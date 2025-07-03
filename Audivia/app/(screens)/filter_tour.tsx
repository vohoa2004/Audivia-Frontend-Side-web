import { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Image
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams } from "expo-router"
import { styles } from "@/styles/filter_tour.styles"
import { getAllTours } from "@/services/tour"
import { getTourTypes } from "@/services/tour_type"
import { COLORS } from "@/constants/theme"
import { NotificationButton } from "@/components/common/NotificationButton"
import { BackButton } from "@/components/common/BackButton"
import { ChatMessageButton } from "@/components/common/ChatMessage"
import { TourItem } from "@/components/common/TourItem"
import { Tour, TourType } from "@/models"
import { useDebounce } from "../../hooks/useDebounce"

export default function FilterTourScreen() {
  const params = useLocalSearchParams()
  const [searchQuery, setSearchQuery] = useState(typeof params.searchQuery === 'string' ? params.searchQuery : "")
  const [tours, setTours] = useState<Tour[]>([])
  const [tourTypes, setTourTypes] = useState<TourType[]>([])
  const [selectedTourType, setSelectedTourType] = useState(typeof params.typeId === 'string' ? params.typeId : "")
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchTourTypes = async () => {
      try {
        const result = await getTourTypes();
        setTourTypes([{ id: "", name: "Tất cả" }, ...result.response]);
      } catch (error) {
        console.error("Lỗi khi lấy loại tour:", error);
      }
    };
    fetchTourTypes();
  }, []);

  useEffect(() => {
    fetchTours(1, true);
  }, [debouncedSearchQuery, selectedTourType]);

  const fetchTours = async (page: number, reset = false) => {
    if (loading && !reset) return;
    setLoading(true);
    try {
      const apiParams = {
        PageIndex: page,
        PageSize: 10,
        Title: debouncedSearchQuery ? debouncedSearchQuery : undefined,
        TourTypeId: selectedTourType ? selectedTourType : undefined
      };

      const response = await getAllTours(apiParams);
      const newTours = response.response.data;

      if (newTours && newTours.length > 0) {
        setTours(prevTours => reset ? newTours : [...prevTours, ...newTours]);
        setPageIndex(page + 1);
        setCanLoadMore(true);
      } else {
        if (reset) setTours([]);
        setCanLoadMore(false);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tour:", error)
    } finally {
      setLoading(false);
    }
  }

  const handleLoadMore = () => {
    if (!loading && canLoadMore) {
      fetchTours(pageIndex);
    }
  };

  const getInitialTourTypeName = () => {
    if (params.tourTypeName) return params.tourTypeName;
    const type = tourTypes.find(t => t.id === selectedTourType);
    return type ? type.name : "Tất cả tour";
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.backIcon}>
            <BackButton />
          </View>
          <Text style={{ fontSize: 24, color: COLORS.darkGrey, marginLeft: 10, }}>Lọc Tour</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.notification}>
            <NotificationButton />
          </View>
          <View style={styles.chat}>
            <ChatMessageButton />
          </View>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <View>
          <Text style={styles.title}>{getInitialTourTypeName()}</Text>
          <Text style={styles.subtitle}>{tours.length} tour audio khả dụng</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.primary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm địa điểm để khám phá"
          placeholderTextColor={COLORS.grey}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={COLORS.grey} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tour Type Filter */}
      <View style={{ marginVertical: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tourTypes.map(type => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.categoryButton,
                selectedTourType === type.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedTourType(type.id)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedTourType === type.id && styles.categoryButtonTextActive
                ]}
              >
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tour List */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={tours}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => <TourItem tour={item} savedTourId={""} />}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator size="large" color={COLORS.primary} /> : null}
        />
      </View>
    </SafeAreaView>
  )
}

