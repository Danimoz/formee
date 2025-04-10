'use client';

import { saveUserSettings } from "@/app/actions/generate-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LLMProvider } from "@/interfaces";
import { useState } from "react";
import { toast } from "sonner";


export default function SettingsForm() {
  const [formData, setFormData] = useState({
    llmProvider: '',
    apiKey: '',
    model: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement> | string) {
    if (typeof event === 'string') {
      setFormData((prevState) => ({
        ...prevState,
        llmProvider: event,
      }));
      return;
    }
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    if (!formData.llmProvider) {
      toast.error('Select an option and API Key or Model')
      return
    }
    try {
      const res = await saveUserSettings(formData)
      if (res.message) toast.success(res.message)
      if (res.error) toast.error(res.error)
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="py-6 space-y-6" onSubmit={handleSubmit}>
      <div className="w-full space-y-2">
        <Label>LLM Provider</Label>
        <Select onValueChange={handleChange} name="llmProvider" value={formData.llmProvider}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(LLMProvider).map((provider) => (
              <SelectItem key={provider} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input onChange={handleChange} name="apiKey" value={formData.apiKey} id="apiKey" placeholder="Enter your API key" />
      </div>

      <div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}