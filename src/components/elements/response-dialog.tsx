/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

interface ResponseDialogProps {
  response: any
}

export default function ResponseDialog({ response }: ResponseDialogProps) {
  const keys = Object.keys(response)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View</Button>
      </DialogTrigger>
      <DialogContent>
        <Card className="max-h-[80vh] overflow-y-auto">
          <CardHeader className="pb-3">
            <DialogTitle>
              <CardTitle>Response Information</CardTitle>
            </DialogTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {keys.map((key) => (
                <div key={key} className="space-y-1">
                  <h3 className="text-sm font-medium capitalize">{key.replaceAll('_', ' ')}</h3>
                  <span>{response[key]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}