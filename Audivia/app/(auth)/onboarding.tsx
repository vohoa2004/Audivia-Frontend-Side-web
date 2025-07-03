import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, FlatList, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '@/styles/onboarding';


interface Slide {
  id: string;
  title: string;
  description: string;
  image: string;
  layout: 'original' | 'new';
}

const slides: Slide[] = [
  {
    id: '1',
    title: 'Khám phá niềm vui của những chuyến đi',
    description: 'Mọi điều bạn tưởng tượng đều có ở đây.',
    image: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1748363861/Audivia/luro9pjc61fbnuots5kn.png',
    layout: 'original',
  },
  {
    id: '2',
    title: 'Hành trình bằng giọng kể cảm xúc',
    description: 'Khám phá những câu chuyện của các địa danh theo cách chưa từng có với hành trình giọng kể cảm xúc độc đáo của chúng tôi. Hãy lắng nghe những lời kể đầy cuốn hút, đưa lịch sử, văn hóa và cuộc sống địa phương trở nên sống động.',
    image: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1748369792/Audivia/zn76qojhgounxregxxhq.png',
    layout: 'new',
  },
  {
    id: '3',
    title: 'Trải nghiệm được cá nhân hóa',
    description: 'Cá nhân hóa hành trình du lịch theo sở thích và nhịp độ của riêng bạn. Dù bạn yêu thích lịch sử, thiên nhiên, ẩm thực hay nghệ thuật, chúng tôi đều mang đến nội dung chọn lọc và lịch trình linh hoạt dành riêng cho bạn.',
    image: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1748418065/Audivia/qmobzvxg3tbobfihzcqr.png',
    layout: 'new',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    slides.forEach(slide => {
      Image.prefetch(slide.image);
    });
  }, []);

  const handleNext = async () => {
    if (currentSlideIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentSlideIndex + 1,
        animated: true
      });
    } else {
      try {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.push('/(auth)/login');
      } catch (error) {
        console.error('Error saving onboarding flag:', error);
      }
    }
  };

  const renderItem: ListRenderItem<Slide> = ({ item }) => {
    if (item.layout === 'original') {
      return (
        <View style={styles.slideOriginal}>
          <MaskedView
            maskElement={
              <Text style={[styles.titleOriginal, { backgroundColor: 'transparent' }]}>
                {item.title}
              </Text>
            }
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.purpleGradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.titleOriginal, { opacity: 0 }]}>{item.title}</Text>
            </LinearGradient>
          </MaskedView>

          <Text style={styles.descriptionOriginal}>{item.description}</Text>
          <Image
            source={{ uri: item.image }}
            style={styles.imageOriginal}
            resizeMode="contain"
          />
        </View>
      );
    } else {
      // New layout for slides 2 and 3 based on the provided image
      const parts = item.title.split(' ');
      const firstPart = parts.slice(0, -1).join(' ');
      const lastPart = parts[parts.length - 1];

      return (
        <View style={styles.slideNew}>
          <Image
            source={{ uri: item.image }}
            style={styles.imageNew}
            resizeMode="cover"
          />
          <View style={styles.textContainerNew}>
            <Text style={styles.titleNew}>
              {firstPart}
              <Text style={styles.highlightedTextNew}>{lastPart}</Text>
            </Text>
            <Text style={styles.descriptionNew}>{item.description}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.light, COLORS.secondary]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: -6 }}
      style={[styles.container]}
    >
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentSlideIndex(index);
        }}
        initialScrollIndex={0}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentSlideIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.purpleGradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <TouchableOpacity onPress={handleNext} style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.buttonText}>
              {currentSlideIndex === slides.length - 1 ? 'Bắt đầu' : 'Tiếp theo'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

