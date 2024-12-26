import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useAddOrUpdateAddressMutation,
  useGetAddressesQuery,
} from "@/store/api";
import { Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil } from "lucide-react";
import { Address } from "@/types/type";
import BookLoader from "@/lib/BookLoader";

interface AddressesResponse {
  success: boolean;
  message: string;
  data: {
    addresses: Address[];
  };
}

const addressFormSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be 10 digits"),
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits"),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

interface AddressComponentProps {
  onAddressSelect: (address: Address) => void;
  selectedAddressId?: string;
}

export function AddressComponent({
  onAddressSelect,
  selectedAddressId,
}: AddressComponentProps) {
  const { data: addressesData, isLoading } = useGetAddressesQuery() as {
    data: AddressesResponse | undefined;
    isLoading: boolean;
  };  
  const [addOrUpdateAddress] = useAddOrUpdateAddressMutation();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const addresses = addressesData?.data?.addresses || [];


  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    form.reset(address);
    setShowAddressForm(true);
  };

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const onSubmit = async (data: AddressFormValues) => {
    try {
      let result;
      if (editingAddress) {
        const updatedAddress = { ...editingAddress, ...data , addressId: editingAddress._id};
        result = await addOrUpdateAddress(updatedAddress).unwrap();
      } else {
        result = await addOrUpdateAddress(data).unwrap();
      }
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Failed to add/update address:", error);
    }
  };

  if (isLoading) return <BookLoader />;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {addresses.map((address: Address) => (
          <Card
            key={address._id}
            className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
              selectedAddressId === address._id
                ? "border-blue-500 shadow-lg"
                : "border-gray-200 shadow-md hover:shadow-lg"
            }`}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Checkbox
                  checked={selectedAddressId === address._id}
                  onCheckedChange={() => onAddressSelect(address)}
                  className="w-5 h-5"
                />
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditAddress(address)}
                  >
                    <Pencil className="h-5 w-5 text-gray-600 hover:text-blue-500" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city}, {address.state} {address.pincode}
                </p>
                <p className="mt-2 font-medium">Phone: {address.phoneNumber}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />{" "}
            {editingAddress ? "Edit Address" : "Add New Address"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="10-digit mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Street address, House number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apartment, suite, unit, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {editingAddress ? "Update Address" : "Add Address"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
