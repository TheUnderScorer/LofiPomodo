import { ChakraProps } from '@chakra-ui/system';
import { HStack } from '@chakra-ui/react';
import { Icon } from './Icon';

export const EllipsisIcon = (props: ChakraProps) => {
  const icon = <Icon fill="brand.iconPrimary" width={2} name="DotFilled" />;

  return (
    <HStack {...props} spacing={0.5}>
      {icon}
      {icon}
      {icon}
    </HStack>
  );
};
