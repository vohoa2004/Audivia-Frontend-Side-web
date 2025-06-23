import { useCallback, useEffect, useState } from "react"
import { FlatList, SafeAreaView, Alert, View } from "react-native"
import styles from "@/styles/save_tour.styles"
import { useUser } from "@/hooks/useUser"
import { getAllSaveTourByUserId, deleteSaveTour } from "@/services/save_tour"
import { SaveTour } from "@/models"
import { TourItem } from "@/components/common/TourItem"
import { SaveTourNotification } from "@/components/save_tour/SaveTourNotification"
import { Header } from "@/components/common/Header"
import { useFocusEffect } from "@react-navigation/native"

export default function SavedToursScreen() {
  const { user } = useUser()
  const [saveTours, setSaveTour] = useState<SaveTour[]>([])

  const refreshSavedTours = async () => {
    if (user?.id) {
      try {
        const res = await getAllSaveTourByUserId(user.id)
        setSaveTour(res)
      } catch (error) {
        console.error('Error refreshing saved tours:', error)
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      refreshSavedTours()
    }, [user?.id])
  )

  const handleDeleteTour = async (tourId: string) => {
    try {
      const saveTourToDelete = saveTours.find(st => st.tour.id === tourId)
      if (!saveTourToDelete) {
        throw new Error('Không tìm thấy tour yêu thích')
      }
      
      await deleteSaveTour(saveTourToDelete.id)
      await refreshSavedTours() 
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa tour yêu thích. Vui lòng thử lại.')
    }
  }



  return (
    <SafeAreaView style={styles.container}>
      <View>
      <Header title="Lưu yêu thích"/>
      <SaveTourNotification savedToursCount={saveTours.length} />
      </View>
      <View style={styles.tourList}>
      <FlatList data={saveTours} 
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TourItem tour={item.tour} isSavedTour={true} onDelete={handleDeleteTour} onSave={refreshSavedTours} savedTourId={item.id}/>}
          showsVerticalScrollIndicator={false} />
      </View>
    </SafeAreaView>
  )
}

