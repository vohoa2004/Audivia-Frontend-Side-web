import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { TourType } from '@/models';
import { router, usePathname } from 'expo-router';
import styles from '@/styles/home.styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';

interface CategoriesProps {
  tourTypes: TourType[];
}

export const Categories = ({ tourTypes }: CategoriesProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      setActiveCategory('all');
    }
  }, [pathname]);

  const handleCategoryPress = (typeId: string) => {
    setActiveCategory(typeId);
    if (typeId === 'all') {
      router.push('/filter_tour');
    } else {
      router.push(`/filter_tour?typeId=${typeId}&tourTypeName=${tourTypes.find(type => type.id === typeId)?.name}`);
    }
  };

  const renderCategoryItem = (category: TourType | { id: string; name: string }, isAll: boolean = false) => {
    const isActive = activeCategory === category.id;

    return (
      <TouchableOpacity
        key={category.id}
        onPress={() => handleCategoryPress(category.id)}
      >
        {isActive ? (
          <LinearGradient
            colors={[COLORS.primary, COLORS.purpleGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.categoryItem}
          >
            <View style={styles.categoryIconContainer}>
              <Image 
                source={{uri: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1748534358/Audivia/qirqc9dl0qmsxzekrk47.png'}}
                style={{
                  width: 46,
                  height: 46,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <Text 
              style={[
                styles.categoryName,
                { color: COLORS.light }
              ]} 
              numberOfLines={1}
            >
              {category.name}
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.categoryItem}>
            <View style={styles.categoryIconContainer}>
              <Image 
                source={{uri: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1748534358/Audivia/qirqc9dl0qmsxzekrk47.png'}}
                style={{
                  width: 46,
                  height: 46,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <Text 
              style={styles.categoryName}
              numberOfLines={1}
            >
              {category.name}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.categoriesSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Danh mục</Text>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {renderCategoryItem({ id: 'all', name: 'Tất cả' }, true)}
          {tourTypes.map((category) => renderCategoryItem(category))}
        </ScrollView>
      </View>
    </View>
  );
}; 