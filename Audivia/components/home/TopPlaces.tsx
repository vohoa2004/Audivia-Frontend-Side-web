import { View, Text } from 'react-native';
import { Tour } from '@/models';
import styles from '@/styles/home.styles';
import { TourItem } from '../common/TourItem';

interface TopPlacesProps {
  top3Tours: Tour[];
  onRefresh?: () => void;
}

export const TopPlaces = ({ top3Tours, onRefresh }: TopPlacesProps) => {
  return (
    <View style={styles.topPlacesSection}>
      <View style={styles.sectionTopPlaceHeader}>
        <Text style={styles.sectionTitle}>Địa điểm nổi bật</Text>
      </View>

      <View>
        {top3Tours.map((tour) => (
          <TourItem key={tour.id} tour={tour} onSave={onRefresh}  />
        ))}
      </View>
    </View>
  );
}; 