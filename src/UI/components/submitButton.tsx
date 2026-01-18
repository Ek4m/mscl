import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import React, { FC } from 'react';

const SubmitButton: FC<
  TouchableOpacityProps & {
    title: string;
    textColor?: string;
    bgColor?: string;
    loading?: boolean;
  }
> = ({
  onPress,
  title,
  bgColor,
  textColor,
  loading,
  disabled,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[
        styles.button,
        style,
        {
          backgroundColor: bgColor || '#fff',
          opacity: disabled || loading ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor || '#000'} />
      ) : (
        <Text style={[styles.buttonText, { color: textColor || '#000' }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  button: {
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
