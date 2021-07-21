import * as React from 'react';
import { ButtonGroup, Button } from '@chakra-ui/react';
import { isExtensionEnabled, setIsExtensionEnabled } from './helpers';
import { Box, Heading } from '@chakra-ui/react';

export function DevToolsSelector() {
  const handleClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    setIsExtensionEnabled(evt.currentTarget.dataset.extension === '1');
    window.location.reload();
  };

  const extensionEnabled = isExtensionEnabled();

  return (
    <Box as="section" p="2">
      <Heading as="h2">Set active devTools</Heading>
      <ButtonGroup variant="outline" spacing="4" p="4">
        <Button
          aria-selected={!extensionEnabled}
          colorScheme="blue"
          selected={!extensionEnabled}
          data-extension="0"
          variant={!extensionEnabled ? 'solid' : 'outline'}
          onClick={handleClick}
        >
          Dock
        </Button>
        <Button
          aria-selected={extensionEnabled}
          data-extension="1"
          colorScheme="blue"
          variant={extensionEnabled ? 'solid' : 'outline'}
          onClick={handleClick}
        >
          Extension
        </Button>
      </ButtonGroup>
    </Box>
  );
}
