"use client"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
const PersonalDetails = () => {
  const [date, setDate] = useState()
  return (
    <Card className="rounded-t-none pt-6">
      <CardContent>
        <div className="grid grid-cols-12 md:gap-x-12 gap-y-5">
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="firstName" className="mb-2">
              First Name
            </Label>
            <Input id="firstName" />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="lastName" className="mb-2">
              Last Name
            </Label>
            <Input id="lastName" />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="phoneNumber" className="mb-2">
              Phone Number
            </Label>
            <Input id="phoneNumber" type="number" />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="email" className="mb-2">
              Email Address
            </Label>
            <Input id="email" />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="email" className="mb-2">
              major
            </Label>
            <Input id="major" />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="language" className="mb-2">
              Language
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="bangla">Bangla</SelectItem>
                <SelectItem value="arabic">Arabic</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <Label htmlFor="country" className="mb-2">
              Country
            </Label>
            <Input id="country" />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <Label htmlFor="city" className="mb-2">
              City
            </Label>
            <Input id="city" />
          </div>
          {/* <div className="col-span-12 md:col-span-6">
            <Label htmlFor="currency" className="mb-2">Currency</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="jpy">JPY</SelectItem>
                <SelectItem value="gbp">GBP</SelectItem>
                <SelectItem value="aud">AUD</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <div className="col-span-12 lg:col-span-6">
            <Label htmlFor="message" className="mb-2">
              About Me
            </Label>
            <Textarea />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <Label htmlFor="message" className="mb-2">
              About Course
            </Label>
            <Textarea />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button color="secondary">Cancel</Button>
          <Button>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalDetails;