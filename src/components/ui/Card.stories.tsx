import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Card } from './Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
      layout: 'centered',
  },
  argTypes: {
    noPadding: {
        control: 'boolean',
        description: 'Remove o padding interno'
    }
  }
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
        <div className="space-y-2">
            <h3 className="font-semibold text-lg">Card Title</h3>
            <p className="text-slate-500">This is a simple card component used to group content.</p>
        </div>
    )
  },
};

export const WithActions: Story = {
    args: {
      className: "w-[350px]",
      children: (
          <div className="space-y-4">
              <div>
                  <h3 className="font-semibold text-lg">Notification</h3>
                  <p className="text-sm text-slate-500">You have a new message from the AI Agent.</p>
              </div>
              <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">Dismiss</Button>
                  <Button size="sm">View</Button>
              </div>
          </div>
      )
    },
};

export const NoPadding: Story = {
    args: {
        noPadding: true,
        className: "w-[300px] overflow-hidden",
        children: (
            <div>
                <div className="h-32 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    Cover Image
                </div>
                <div className="p-4">
                    <h3 className="font-semibold">Article Title</h3>
                    <p className="text-sm text-slate-500 mt-1">Short description here.</p>
                </div>
            </div>
        )
    }
}
