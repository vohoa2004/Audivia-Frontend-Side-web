import { Text, View, StyleSheet } from "react-native"

type TranscriptProps = {
  text: string
}

export default function Transcript({ text }: TranscriptProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.transcriptText}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transcriptText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#333",
    fontStyle: "italic",
  },
})
