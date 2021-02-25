import { css } from '@emotion/react';

export const pixelBordersCss = css`
  .border-step1 {
    border-style: solid;
    border-width: 0.125em 0;
    margin: 0 0.125em;
    padding: 0.5em;
    position: relative;
    z-index: 1;

    &:before {
      border: inherit;
      border-width: 0 0.125em;
      content: '';
      height: 100%;
      left: -0.125em;
      pointer-events: none;
      position: absolute;
      top: 0;
      right: -0.125em;
      z-index: -1;
    }
  }

  .border-step2 {
    border-style: solid;
    border-width: 0.125em 0;
    margin: 0 0.25em;
    padding: 0.5em 0.375em;
    position: relative;
    z-index: 1;

    &:before {
      background-color: inherit;
      border: inherit;
      border-width: 0 0.125em;
      bottom: 0.125em;
      content: '';
      left: -0.25em;
      pointer-events: none;
      position: absolute;
      top: 0.125em;
      right: -0.25em;
      z-index: -1;
    }

    &:after {
      border: inherit;
      border-width: 0 0.125em;
      bottom: 0;
      content: '';
      left: -0.125em;
      position: absolute;
      top: 0;
      right: -0.125em;
      z-index: -2;
    }
  }

  .border-step3 {
    border-style: solid;
    border-width: 0.125em 0;
    box-shadow: -0.25em 0 0 -0.125em, 0.25em 0 0 -0.125em;
    margin: 0 0.375em;
    padding: 0.5em 0.25em;
    position: relative;
    z-index: 1;

    &:before {
      background-color: inherit;
      border: inherit;
      border-width: 0 0.125em;
      bottom: 0.25em;
      content: '';
      left: -0.375em;
      pointer-events: none;
      position: absolute;
      top: 0.25em;
      right: -0.375em;
      z-index: -1;
    }

    &:after {
      background: inherit;
      border: inherit;
      border-width: 0 0.125em;
      bottom: 0.125em;
      content: '';
      left: -0.25em;
      position: absolute;
      top: 0.125em;
      right: -0.25em;
      z-index: -2;
    }
  }

  .border-step4 {
    border-style: solid;
    border-width: 0.125em 0;
    box-shadow: -0.375em 0 0 -0.125em, 0.375em 0 0 -0.125em;
    margin: 0 0.5em;
    padding: 0.5em 0.125em;
    position: relative;
    z-index: 1;

    &:before {
      background-color: inherit;
      border: inherit;
      border-width: 0 0.125em;
      bottom: 0.375em;
      content: '';
      left: -0.5em;
      pointer-events: none;
      position: absolute;
      top: 0.375em;
      right: -0.5em;
      z-index: -1;
    }

    &:after {
      background-color: inherit;
      border: inherit;
      border-width: 0 0.125em;
      bottom: 0.125em;
      content: '';
      left: -0.375em;
      position: absolute;
      top: 0.125em;
      right: -0.375em;
      z-index: -2;
    }
  }
`;
