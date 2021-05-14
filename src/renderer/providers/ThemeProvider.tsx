import React, { PropsWithChildren, useMemo } from 'react';
import { usePrefersColorScheme } from '../shared/hooks/usePrefersColorScheme';
import { Theme, ThemeShadows } from '../types/theme';
import { theme as chakraTheme } from '@chakra-ui/theme';
import {
  ChakraProvider,
  ColorModeProvider,
  extendTheme,
  theme,
} from '@chakra-ui/react';
import { PomodoroStates } from '../../shared/types';
import { nesCss } from '../styles/nes.css';
import { Global } from '@emotion/react';
import { pixelBordersCss } from '../styles/pixelBorders.css';
import { Icon } from '../ui/atoms/icons/Icon';

export interface ThemeProviderProps {}

console.log({
  filled: theme.components.NumberInput.variants.filled({}),
  flushed: theme.components.NumberInput.variants.flushed({}),
  outline: theme.components.NumberInput.variants.outline({}),
  unstyled: theme.components.NumberInput.variants.unstyled,
  base: theme.components.NumberInput.baseStyle({}),
});

export const ThemeProvider = ({
  children,
}: PropsWithChildren<ThemeProviderProps>) => {
  const colorMode = usePrefersColorScheme();

  const theme: Theme = useMemo(() => {
    const danger = '#FC8181';
    const primary = chakraTheme.colors.blue;

    const color =
      colorMode === 'dark'
        ? chakraTheme.colors.white
        : chakraTheme.colors.black;

    const shadows: ThemeShadows = {
      ...chakraTheme.shadows,
      active: 'inset 4px 4px #adafbc',
      focus: '0 0 0 6px rgba(173, 175, 188, 0.3)',
      hover: 'inset -4px -4px #adafbc',
      selected: `0 0 0 6px rgba(173, 175, 188, 0.3)`,
    };

    const bg =
      colorMode === 'dark'
        ? chakraTheme.colors.black
        : chakraTheme.colors.white;

    const nesBorder = {
      border: '2px solid',
      borderRadius: 4,
      position: 'relative',
      borderImageSource:
        colorMode === 'dark'
          ? `url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(255,255,255)" /></svg>') !important`
          : ` url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>') !important`,
      borderImageSlice: '2',
      borderImageWidth: '3',
      borderImageRepeat: 'repeat',
      borderImageOutset: '2',
      backgroundClip: 'padding-box',
      bg,
    };

    const nesVariant = {
      ...nesBorder,

      '&::after': {
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        content: '""',
        boxShadow: 'inset -3px -3px #adafbc',
      },

      '&:hover::after': {
        boxShadow: shadows.hover,
      },

      '&:focus': {
        boxShadow: shadows.focus,
      },

      '&:active': {
        boxShadow: shadows.active,
      },

      '&[aria-invalid=true]': {
        boxShadow: `inset -4px -4px ${danger}`,
      },

      '&[aria-selected=true]': {
        background: primary['500'],
      },
    };

    const nesOutlineVariant = {
      ...nesVariant,
      bg: 'transparent',
    };

    const nesGhostVariant = {
      ...nesBorder,
      borderRadius: 0,

      '&:not([aria-selected=true])': {
        borderImage: 'none',
        border: 'none',
      },

      '&:active': {
        boxShadow: shadows.active,
      },

      '&[aria-invalid=true]': {
        boxShadow: `inset -4px -4px ${danger}`,
      },
    };

    const nesVariants = {
      nes: nesVariant,
      'nes-outlined': nesOutlineVariant,
      'nes-ghost': nesGhostVariant,
    };

    const buttonDefaults = {
      variants: {
        ...nesVariants,
      },
      defaultProps: {
        variant: 'nes',
      },
    };

    return extendTheme<Theme>({
      colors: {
        brand: {
          [PomodoroStates.Work]: primary['300'],
          [PomodoroStates.Break]: chakraTheme.colors.green['300'],
          [PomodoroStates.LongBreak]: chakraTheme.colors.green['600'],
          paper: '#eee6e6',
          success: chakraTheme.colors.green['500'],
          primary,
          colorModeContrast:
            colorMode === 'dark' ? '#FFFCFC' : chakraTheme.colors.white,
          textPrimary: color,
          textSecondary: chakraTheme.colors.gray['500'],
          iconPrimary: color,
          danger,
          bg,
        },
      },
      shadows,
      config: {
        initialColorMode: colorMode,
      },
      fonts: {
        body: 'PixelFont',
        heading: 'PixelFont',
        mono: 'PixelFont',
      },
      components: {
        Checkbox: {
          defaultProps: {
            colorScheme: 'brand.primary',
            variant: 'nes',
          },
          variants: {
            nes: {
              ...nesBorder,
              borderImageWidth: '2',
              borderColor: 'transparent',
            },
          },
        },
        Menu: {
          variants: {
            nes: {
              list: {
                ...nesBorder,
                borderRadius: 0,
                boxShadow: shadows['dark-lg'],
              },
            },
          },
          defaultProps: {
            variant: 'nes',
          },
          baseStyle: () => ({
            list: {
              zIndex: 100,
            },
          }),
        },
        Tabs: {
          variants: {
            nes: {
              tablist: {
                '& button.chakra-button, & .chakra-tabs__tab': {
                  ...nesVariants['nes-outlined'],
                  borderImage: 'none',
                  mr: 2,
                  borderRadius: 0,
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottom: 'none',

                  '&, &:focus': {
                    boxShadow: 'none',
                  },

                  '&::after, &::before, &:hover::after,  &:focus::after, &:active::after': {
                    boxShadow: 'none',
                    borderImage: 'none',
                    border: 'none',
                  },

                  '&::after': {
                    content: '""',
                    width: '100%',
                    height: 1,
                    background: chakraTheme.colors.black,
                    position: 'absolute',
                    top: '100%',
                    transition: 'none',
                  },

                  '&[aria-selected=true]': {
                    backgroundColor: 'transparent',

                    '&::after': {
                      backgroundColor: 'brand.primary.500',
                    },
                  },
                },
              },
            },
          },
          defaultProps: {
            variant: 'nes',
          },
        },
        Button: {
          ...buttonDefaults,
        },
        Tooltip: {
          variants: {
            ...nesVariants,
            nes: {
              ...nesVariants.nes,
              borderImage: 'none',
              boxShadow: shadows['dark-lg'],
              pt: 2,
              pb: 2,
              color,
            },
          },
          defaultProps: {
            variant: 'nes',
          },
        },
        Input: {
          variants: {
            ...nesVariants,
          },
          defaultProps: {
            variant: 'nes',
          },
        },
        Select: {
          variants: {
            nes: {
              field: nesVariants.nes,
            },
            'nes-outlined': {
              field: nesVariants['nes-outlined'],
            },
            'nes-ghost': {
              field: nesVariants['nes-ghost'],
            },
          },
          defaultProps: {
            variant: 'nes',
          },
        },
        NumberInput: {
          variants: {
            nes: {
              field: {
                ...nesVariant,

                '& .chakra-select': {
                  '&, &:active, &:focus': {
                    outline: 'none',
                    borderColor: 'transparent',
                  },
                },
              },
              stepper: {},
            },
          },
          defaultProps: {
            variant: 'nes',
          },
        },
        NumberDecrementStepper: {
          defaultProps: {
            children: <Icon name="Arrow" />,
          },
        },
        IconButton: {
          ...buttonDefaults,
        },
        Container: {
          baseStyle: ({ colorMode }) => ({
            bg:
              colorMode === 'dark'
                ? chakraTheme.colors.black
                : chakraTheme.colors.white,
          }),
        },
        Badge: {
          variants: {
            nes: {
              ...chakraTheme.components.Badge.variants.solid,
              ...nesBorder,
              padding: 0,
              borderRadius: 6,
              boxSize: 6,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          },
          defaultProps: {
            variant: 'nes',
          },
        },
      },
      styles: {
        global: {
          body: {
            fontFamily: 'PixelFont',
            overflow: 'visible',
          },
          'div.chakra-checkbox__control': {
            borderColor: color,
          },
          'html body input': {
            color,
          },
          '.path-inherit': {
            fill: 'inherit',
          },
          '#root input.is-rounded': {
            borderImageWidth: '4 !important',
          },
        },
      },
    });
  }, [colorMode]);

  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{ initialColorMode: colorMode, useSystemColorMode: true }}
      >
        {children}
        <Global styles={[nesCss, pixelBordersCss]} />
      </ColorModeProvider>
    </ChakraProvider>
  );
};
