import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    slideOriginal: {
      width: width,
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 60,
      flex: 1,
      justifyContent: 'center',
    },
    titleOriginal: {
      fontSize: 40,
      fontWeight: 'bold',
      color: COLORS.primary,
      textAlign: 'left',
      marginBottom: 12,
    },
    descriptionOriginal: {
      fontSize: 18,
      color: COLORS.grey,
      textAlign: 'left',
      marginBottom: 36,
    },
    imageOriginal: {
      width: 400,
      height: 450,
      marginBottom: 24,
    },
    slideNew: {
      width: width,
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    imageNew: {
      width: width,
      height: Dimensions.get('window').height * 0.6,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    textContainerNew: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 24,
      paddingTop: 20,
      alignItems: 'center',
    },
    titleNew: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
      marginBottom: 15,
    },
    highlightedTextNew: {
      color: COLORS.primary,
    },
    descriptionNew: {
      fontSize: 18,
      color: COLORS.grey,
      textAlign: 'center',
      marginBottom: 20,
    },
    buttonContainer: {
      width: '80%',
      marginBottom: 20,
      alignSelf: 'center',
    },
    gradientButton: {
      borderRadius: 50,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: COLORS.light,
      fontWeight: '600',
      fontSize: 16,
    },
    indicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: COLORS.grey,
      marginHorizontal: 6,
    },
    activeDot: {
      backgroundColor: COLORS.primary,
      width: 20,
    },
  });
  
export default styles