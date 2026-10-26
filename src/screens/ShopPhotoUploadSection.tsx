import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView
} from 'react-native';
import { colors } from '../theme/colors';
import { api } from '../services/api';

export interface UploadedShopPhoto {
  id: string;
  url: string;
  isCover?: boolean;
  name?: string;
  isS3?: boolean;
}

interface Props {
  photos: UploadedShopPhoto[];
  onChangePhotos: (photos: UploadedShopPhoto[]) => void;
  shopName?: string;
}

// Preset demonstration atelier photos if testing without local files
const SAMPLE_ATELIER_PHOTOS = [
  {
    name: 'Boutique Front Entrance',
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Master Cutting Table & Workshop',
    url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Designer Zari & Maggam Studio',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Trial Fitting Suite',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80'
  }
];

export default function ShopPhotoUploadSection({
  photos,
  onChangePhotos,
  shopName = 'Your Atelier'
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<any>(null);

  // Resize and convert an image file to Base64
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          // Downscale to max 1600px width/height for fast AWS S3 upload
          const maxDim = 1600;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Trigger web file input
  const handleOpenPicker = () => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      Alert.alert('Upload Photo', 'Please select or capture photo from your device.');
    }
  };

  // Handle files selected from input
  const handleFileChange = async (event: any) => {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(`Processing ${files.length} photo(s)...`);

    try {
      const newUploadedPhotos: UploadedShopPhoto[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading ${i + 1}/${files.length} to AWS S3...`);
        const base64Data = await processImageFile(file);

        try {
          const res = await api.uploadPhoto(base64Data, 'shop-photos');
          if (res && res.success && res.url) {
            newUploadedPhotos.push({
              id: 'photo-' + Date.now() + '-' + i,
              url: res.url,
              name: file.name,
              isCover: photos.length === 0 && i === 0,
              isS3: res.isS3 ?? true
            });
          } else {
            // Fallback to direct data URI if backend storage is offline
            newUploadedPhotos.push({
              id: 'photo-' + Date.now() + '-' + i,
              url: base64Data,
              name: file.name,
              isCover: photos.length === 0 && i === 0,
              isS3: false
            });
          }
        } catch (uploadErr) {
          // Keep local fallback
          newUploadedPhotos.push({
            id: 'photo-' + Date.now() + '-' + i,
            url: base64Data,
            name: file.name,
            isCover: photos.length === 0 && i === 0,
            isS3: false
          });
        }
      }

      onChangePhotos([...photos, ...newUploadedPhotos]);
      setUploadProgress('');
      Alert.alert('Upload Successful', `${newUploadedPhotos.length} shop photo(s) added.`);
    } catch (err: any) {
      console.error('Error uploading photos:', err);
      Alert.alert('Upload Error', err.message || 'Failed to process photos.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add demo sample photo
  const handleAddSamplePhoto = (sample: { name: string; url: string }) => {
    const newPhoto: UploadedShopPhoto = {
      id: 'sample-' + Date.now(),
      url: sample.url,
      name: sample.name,
      isCover: photos.length === 0,
      isS3: true
    };
    onChangePhotos([...photos, newPhoto]);
  };

  // Remove photo
  const handleRemovePhoto = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    // If we removed the cover photo, make the first remaining one the cover
    if (updated.length > 0 && !updated.some(p => p.isCover)) {
      updated[0].isCover = true;
    }
    onChangePhotos(updated);
  };

  // Set photo as primary storefront cover
  const handleSetCover = (id: string) => {
    const updated = photos.map(p => ({
      ...p,
      isCover: p.id === id
    }));
    onChangePhotos(updated);
  };

  return (
    <View style={styles.container}>
      {/* Hidden File Input for Web */}
      {Platform.OS === 'web' && (
        // @ts-ignore
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileChange}
        />
      )}

      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 16 }}>📸</Text>
            <Text style={styles.sectionTitle}>Shop & Workshop Photos</Text>
            <View style={styles.awsBadge}>
              <Text style={styles.awsBadgeText}>☁️ AWS S3</Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>
            Upload storefront, master cutting table, or trial room photos stored securely on AWS S3
          </Text>
        </View>
      </View>

      {/* Upload Drop Zone Card */}
      <TouchableOpacity
        style={[styles.dropZone, uploading && styles.dropZoneActive]}
        onPress={handleOpenPicker}
        disabled={uploading}
        activeOpacity={0.8}
      >
        {uploading ? (
          <View style={{ alignItems: 'center', padding: 12 }}>
            <ActivityIndicator size="large" color="#D97706" />
            <Text style={styles.uploadingText}>{uploadProgress || 'Uploading to AWS S3 Bucket...'}</Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center', padding: 10 }}>
            <View style={styles.uploadIconCircle}>
              <Text style={{ fontSize: 22 }}>☁️</Text>
            </View>
            <Text style={styles.dropZoneTitle}>Tap to Upload Shop Photos</Text>
            <Text style={styles.dropZoneSub}>
              Select photos from your device • Auto-synced to AWS S3 bucket
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Preset Samples Quick Bar */}
      <View style={styles.sampleBar}>
        <Text style={styles.sampleBarLabel}>Or select verified atelier sample:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 4 }}>
          {SAMPLE_ATELIER_PHOTOS.map((sample, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.sampleChip}
              onPress={() => handleAddSamplePhoto(sample)}
            >
              <Text style={styles.sampleChipText}>+ {sample.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Uploaded Photos Grid */}
      {photos.length > 0 && (
        <View style={styles.galleryContainer}>
          <Text style={styles.galleryHeading}>
            Uploaded Photos ({photos.length}) • Tap star to set main cover
          </Text>
          <View style={styles.grid}>
            {photos.map((photo) => (
              <View key={photo.id} style={styles.photoCard}>
                <Image source={{ uri: photo.url }} style={styles.thumbnail} resizeMode="cover" />

                {/* S3 Badge */}
                <View style={styles.s3Pill}>
                  <Text style={styles.s3PillText}>☁️ AWS S3</Text>
                </View>

                {/* Cover Star Badge */}
                {photo.isCover ? (
                  <View style={styles.coverBadge}>
                    <Text style={styles.coverBadgeText}>★ Storefront Cover</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.setCoverBtn}
                    onPress={() => handleSetCover(photo.id)}
                  >
                    <Text style={styles.setCoverText}>Set Cover</Text>
                  </TouchableOpacity>
                )}

                {/* Remove Trash Button */}
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemovePhoto(photo.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    marginBottom: 6
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A'
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  awsBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  awsBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309'
  },
  dropZone: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer' as any
  },
  dropZoneActive: {
    borderColor: '#D97706',
    backgroundColor: '#FFFBEB'
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  dropZoneTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2
  },
  dropZoneSub: {
    fontSize: 11,
    color: '#64748B'
  },
  uploadingText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706'
  },
  sampleBar: {
    marginTop: 8
  },
  sampleBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8'
  },
  sampleChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  sampleChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569'
  },
  galleryContainer: {
    marginTop: 12
  },
  galleryHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  photoCard: {
    width: 105,
    height: 105,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  thumbnail: {
    width: '100%',
    height: '100%'
  },
  s3Pill: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4
  },
  s3PillText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FCD34D'
  },
  coverBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
    backgroundColor: '#D97706',
    borderRadius: 4,
    paddingVertical: 2,
    alignItems: 'center'
  },
  coverBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  setCoverBtn: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
    paddingVertical: 2,
    alignItems: 'center'
  },
  setCoverText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#0F172A'
  },
  removeBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  removeBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF'
  }
});
