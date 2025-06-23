import React, { useRef, useEffect } from "react";
import { Animated, PanResponder, StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BUTTON_SIZE = 60;

const FloatingButton = ({ onPress }: { onPress?: () => void }) => {
  const pan = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH - 80, y: SCREEN_HEIGHT - 180 })).current;
  const position = useRef({ x: SCREEN_WIDTH - 80, y: SCREEN_HEIGHT - 180 });

  useEffect(() => {
    const listenerId = pan.addListener((value) => {
      position.current = value;
    });
    return () => {
      pan.removeListener(listenerId);
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: position.current.x,
          y: position.current.y
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const { x, y } = position.current;

        // Snap to closest edge
        let finalX = x < SCREEN_WIDTH / 2 ? 20 : SCREEN_WIDTH - BUTTON_SIZE - 20;
        let finalY = Math.max(20, Math.min(y, SCREEN_HEIGHT - BUTTON_SIZE - 20));

        Animated.spring(pan, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
          tension: 60,
          friction: 7,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.floatingButton, pan.getLayout()]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity onPress={onPress}>
        <Image source={require('@/assets/images/logo.png')} style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    zIndex: 500,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default FloatingButton;
