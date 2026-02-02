import type { Meta, StoryObj } from '@storybook/react';
import { Mail, Save, Trash2 } from 'lucide-react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost', 'outline'],
      description: 'Estilo visual do botão'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
      description: 'Tamanho do botão'
    },
    isLoading: {
      control: 'boolean',
      description: 'Estado de carregamento'
    },
    disabled: {
      control: 'boolean'
    }
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Action',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Action',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    children: 'Delete Item',
    variant: 'danger',
  },
  render: (args) => (
    <Button {...args}>
      <Trash2 className="w-4 h-4 mr-2" />
      Delete Item
    </Button>
  )
};

export const Outline: Story = {
  args: {
    children: 'Cancel',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'More Options',
    variant: 'ghost',
  },
};

export const Loading: Story = {
  args: {
    children: 'Saving...',
    isLoading: true,
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">
        <Mail className="w-4 h-4 mr-2" />
        Send Email
      </Button>
      <Button variant="secondary">
        <Save className="w-4 h-4 mr-2" />
        Save Draft
      </Button>
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" variant="secondary">
        <Mail className="w-4 h-4" />
      </Button>
    </div>
  )
};
