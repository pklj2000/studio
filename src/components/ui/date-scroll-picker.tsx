"use client"

import React, { useState, useEffect, useRef } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const DateScrollPicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.deltaY > 0) {
      handleDateChange(addDays(selectedDate, 1));
    } else {
      handleDateChange(subDays(selectedDate, 1));
    }
  };

  const handlePrevDay = () => {
    handleDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    handleDateChange(addDays(selectedDate, 1));
  };

  return (
    <div className="flex items-center justify-center p-4" onWheel={handleScroll} ref={containerRef}>
      <Button variant="outline" size="icon" onClick={handlePrevDay}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Card className="mx-4">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-lg font-semibold">{format(selectedDate, 'dd/MM/yyyy')}</p>
          </div>
        </CardContent>
      </Card>
      <Button variant="outline" size="icon" onClick={handleNextDay}>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DateScrollPicker;