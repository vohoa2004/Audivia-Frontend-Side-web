import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { COLORS } from '@/constants/theme'
import Animated from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { View, Dimensions } from 'react-native'

export default function TabLayout() {
  const windowWidth = Dimensions.get('window').width;

  return (
    <Tabs screenOptions={{
      tabBarShowLabel: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.grey,
      tabBarStyle: {
        borderRadius: 20,
        height: 60,
        marginHorizontal: 20,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: 1,
        opacity: 1,
        position: 'absolute',
        bottom: 0,
        elevation: 0,
        backgroundColor: 'white',
      },
    }}>
      {[
        { name: 'index', icon: 'home-outline' },
        { name: 'forum', icon: 'people-outline' },
        { name: 'map', icon: 'map-outline' },
        { name: 'save_tour', icon: 'heart-outline' },
        { name: 'menu', icon: 'menu-outline' },
      ].map(({ name, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            headerShown: false,
            tabBarItemStyle: {
              flex: 1,
              marginHorizontal: 5,
              alignItems: 'center',
              justifyContent: 'center',
            },
            tabBarIcon: ({ color, focused }) => {
              const circleSize = 60
              const iconSize = 24

              if (focused) {
                return (
                  <View style={{ width: 75, height: 75, alignItems: 'center', justifyContent: 'center' }}>
                    <Animated.View
                      style={{
                        position: 'absolute',
                        top: -30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: circleSize,
                        height: circleSize,
                        borderRadius: circleSize / 2,
                        borderWidth: 3,
                        backgroundColor: COLORS.light,
                        borderColor: COLORS.light,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 6,
                        elevation: 8,
                        transform: [{ scale: 1 }],
                        overflow: 'hidden'
                      }}
                    >
                      <LinearGradient
                        colors={[COLORS.primary, COLORS.purpleGradient]} 
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          flex: 1,
                          width: 52,
                          height:52,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: circleSize / 2,
                        }}
                      >
                        <Ionicons name={icon as any} size={iconSize} color="white" />
                      </LinearGradient>
                    </Animated.View>
                  </View>
                )
              }

              // Icon thường (không active)
              return (
                <Ionicons name={icon as any} size={iconSize} color={color} />
              )
            }

          }}
        />
      ))}
    </Tabs>
  )
}