import React, { useEffect } from 'react'
import { Redirect } from 'expo-router'

export default function Index() {
    useEffect(() => {
    document.title = "Audivia - Du lịch bằng âm thanh";
  }, []);
  return (
    <Redirect href="/(auth)/login" />
  )
}