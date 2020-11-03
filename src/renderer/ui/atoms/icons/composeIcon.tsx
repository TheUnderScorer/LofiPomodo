import { BaseIconProps, ColorIconMap } from './types';
import { FC, useMemo } from 'react';
import React from 'react';
import { BoxProps, Image, useColorMode, useTheme } from '@chakra-ui/core';
import { ColorMode } from '../../../../shared/types/color';
import { Theme } from '../../../types/theme';

export interface ComposeIconParams<AdditionalProps extends object>
  extends BoxProps {
  iconMap: ColorIconMap;
  type: 'img' | 'svg';
  alt?: string;
  additionalProps?: (passedProps: AdditionalProps, theme: Theme) => BoxProps;
}

export const composeIcon = <Props extends BaseIconProps>(
  params: ComposeIconParams<Props>
): FC<Props> => (props) => {
  const theme = useTheme() as Theme;
  const themeColorMode = useColorMode();
  const colorMode = props.variant ?? themeColorMode ?? 'light';

  const additionalProps = useMemo(
    () => (params.additionalProps ? params.additionalProps(props, theme) : {}),
    [props, theme]
  );

  return (
    <>
      {params.type === 'img' && (
        <Image
          width={props.width}
          height={props.height}
          src={params.iconMap[colorMode as ColorMode] as string}
          alt={params.alt!}
          {...(props as any)}
          {...(additionalProps as any)}
        />
      )}
    </>
  );
};
