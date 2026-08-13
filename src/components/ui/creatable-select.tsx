'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface CreatableSelectOption {
  value: string
  label: string
}

interface CreatableSelectProps {
  options: CreatableSelectOption[]
  value?: string
  onValueChange: (value: string) => void
  onCreateOption?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
}

export function CreatableSelect({
  options,
  value,
  onValueChange,
  onCreateOption,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  className,
  disabled = false,
}: CreatableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value) || (value ? { value, label: value } : undefined)
  }, [options, value])

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options
    const query = searchQuery.toLowerCase()
    return options.filter((option) =>
      option.label.toLowerCase().includes(query)
    )
  }, [options, searchQuery])

  const showCreateOption = searchQuery.trim().length > 0 && !options.some(opt => opt.label.toLowerCase() === searchQuery.trim().toLowerCase())

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full justify-between font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-11 border-none focus:ring-0"
          />
          <CommandList>
            <CommandEmpty>
              <div className="py-4 text-center space-y-2">
                <p className="text-xs text-muted-foreground">{emptyMessage}</p>
                {onCreateOption && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-xs border-blue-200 text-blue-600 hover:bg-blue-50 font-bold gap-1"
                    onClick={() => {
                      onCreateOption(searchQuery.trim())
                      setOpen(false)
                      setSearchQuery('')
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {searchQuery.trim() ? `Create "${searchQuery.trim()}"` : '+ Add New Category'}
                  </Button>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : option.value) 
                    setOpen(false)
                    setSearchQuery('')
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
              {showCreateOption && (
                <CommandItem
                  value={searchQuery}
                  onSelect={() => {
                    if (onCreateOption) {
                      onCreateOption(searchQuery.trim())
                    } else {
                      onValueChange(searchQuery.trim())
                    }
                    setOpen(false)
                    setSearchQuery('')
                  }}
                  className="cursor-pointer text-white bg-blue-600 data-[selected='true']:bg-blue-700 data-[selected='true']:text-white hover:bg-blue-700 focus:bg-blue-700 font-medium mt-1 flex items-center justify-center py-2 rounded-md"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Create "{searchQuery.trim()}"
                </CommandItem>
              )}
            </CommandGroup>
            {onCreateOption && !showCreateOption && options.length > 0 && (
              <div className="p-1 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold gap-1.5 h-9"
                  onClick={() => {
                    onCreateOption('')
                    setOpen(false)
                    setSearchQuery('')
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Add New Category
                </Button>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
