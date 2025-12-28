import React, { useMemo, useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Platform, Animated, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Text, IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

const tabIcons: Record<string, string> = {
  Home: 'home',
  Workouts: 'dumbbell',
  Sessions: 'calendar',
  Exercises: 'target',
};

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const overlayWidth = Dimensions.get('window').width * 1.2;
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDesktop = Platform.OS === 'web';

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [overlayLabel, setOverlayLabel] = useState<string | null>(null);

  // helper method to get Tab label
  const getLabel = (route) => (descriptors[route.key].options.tabBarLabel ??
      descriptors[route.key].options.title ??
      route.name) as string;

  /* ----------------------------------------
   * Per-tab hover / press animations
   * -------------------------------------- */
  const tabAnimations = useRef(
    state.routes.reduce<Record<string, Animated.Value>>((acc, route) => {
      acc[route.key] = new Animated.Value(0);
      return acc;
    }, {})
  ).current;

  /* ----------------------------------------
   * Mobile overlay animation (single source)
   * -------------------------------------- */
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const overlayHeightAnim = useRef(new Animated.Value(0)).current;
  /* ----------------------------------------
   * Overlay driven ONLY by pressedKey
   * -------------------------------------- */
  useEffect(() => {
    Animated.spring(overlayAnim, {
      toValue: pressedKey ? 1 : 0,
      tension: 80,
      friction: 4,
      useNativeDriver: false,
    }).start();
  }, [pressedKey, overlayAnim]);

  /* ----------------------------------------
   * Hover / press handlers
   * -------------------------------------- */
  const animateTab = (key: string, toValue: number) => {
    Animated.timing(tabAnimations[key], {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const handleHoverIn = (route: any) => {
    if (!isDesktop) return;
    setHoveredKey(route.key);
    setOverlayLabel(getLabel(route));
    animateTab(route.key, 1);
  };

  const handleHoverOut = (route: any) => {
    if (!isDesktop) return;
    setHoveredKey(null);
    setOverlayLabel(null);
    animateTab(route.key, 0);
  };

  const handlePressIn = (route: any) => {
    setPressedKey(route.key);
    setOverlayLabel(getLabel(route));
    animateTab(route.key, 1);
  };

  const handlePressOut = (route: any) => {
    setPressedKey(null);
    setOverlayLabel(null);
    animateTab(route.key, 0);
  };

  const containerStyle = useMemo(
    () => [
      {
        backgroundColor: 'transparent',
        borderTopColor: theme.background,
        borderTopWidth: 1,
        flexDirection: 'column' as const,
        position: 'relative' as const,
        overflow: 'visible' as const,
        paddingBottom: Math.max(insets.bottom, 14),
      } 
    ],
    [insets.bottom, theme.border]
  );

  const tabBarStyle = useMemo(
    () => [
      styles.tabBarContainer,
      {
        zIndex: 10,
        backgroundColor: theme.surface,
      }
    ],
    [theme.border, theme.surface]
  );

  const mobileOverlayStyle = useMemo(
    () => [
      {
        position: 'absolute',
        left: 0 as const,
        right: 0 as const,
        bottom: 2 * Math.max(insets.bottom, 14) - 2,
        backgroundColor: theme.primary,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        height: 100,
        opacity: overlayAnim,
        borderRadius: 12,
        transform: [
          {
            translateY: overlayAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          },
          {
            scaleY: overlayAnim
          }
        ],
      }
    ],
    [theme.border]
  )

  /* ----------------------------------------
   * Render
   * -------------------------------------- */
  return (
    <View style={[containerStyle]}>
      {/* ---------------- Mobile overlay ---------------- */}
        {!isDesktop && (
        <Animated.View
          pointerEvents="none"
          style={[
            mobileOverlayStyle
          ]}
        >
          <Svg
            width={overlayWidth}
            height={100}
            viewBox={`0 0 ${overlayWidth} 100`}
            style={{ position: 'absolute', top: 0 }}
          >
            <Path
              d={`M 0,0 Q ${overlayWidth/2},40 ${overlayWidth},0 L ${overlayWidth},100 L 0,100 Z`}
              fill={theme.primary}
            />
          </Svg>
          <Text style={styles.overlayText}>{overlayLabel}</Text>
          </Animated.View>
        )}

      <View style={[tabBarStyle]}>
        {state.routes.map((route, index) => {
          const isFocused = index === state.index;
          const isHovered = hoveredKey === route.key;
          const isPressed = pressedKey === route.key;
          const isActive = isFocused || isHovered || isPressed;
          const icon = tabIcons[route.name] ?? 'help-circle';

          return (
            <View key={route.key} style={[styles.tabContainer]}>
              {/* Desktop hover background */}
              {isDesktop && (
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.hoverBackground,
                    {
                      zIndex: 10,
                      backgroundColor: theme.primary,
                      opacity: tabAnimations[route.key],
                      transform: [
                        { 
                          scaleX: tabAnimations[route.key] 
                        },
                        { 
                          scaleY: isActive ? 1.25 : 1 
                        },
                      ],
                    },
                  ]}
                >
                  <Text pointerEvents="none" style={styles.hoverText}>{overlayLabel}</Text>
                </Animated.View>
              )}

              <Pressable
                onPress={() => navigation.navigate(route.name)}
                onPressIn={() => handlePressIn(route)}
                onPressOut={() => handlePressOut(route)}
                onHoverIn={() => handleHoverIn(route)}
                onHoverOut={() => handleHoverOut(route)}
                style={[
                  styles.tab,
                  {
                    paddingVertical: isDesktop ? 0: 20,
                    backgroundColor: isActive ? theme.primary : theme.surface,
                    borderColor: isActive ? theme.primary : theme.surface,
                  },
                ]}
              >
                {(
                  <IconButton
                    icon={icon}
                    size={24}
                    iconColor={isActive ? theme.surface : theme.primary}
                    onPress={undefined}
                    onHoverIn={undefined}
                    onHoverOut={undefined}
                  />
                )}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ----------------------------------------
 * Styles
 * -------------------------------------- */
const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  tabContainer: {
    flex: 1,
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tabText: {
    fontSize: 18,
  },
  hoverBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hoverText: {
    justifyContent: 'flex-start',
    color: '#fff',
    fontWeight: '600',
    fontSize: 18
  },
  overlayText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
});
