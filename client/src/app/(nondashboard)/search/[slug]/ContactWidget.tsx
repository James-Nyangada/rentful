import { Button } from "@/components/ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ViewingModal } from "./ViewingModal";

const ContactWidget = ({ property, onOpenModal }: ContactWidgetProps) => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);

  const handleButtonClick = () => {
    onOpenModal();
  };

  return (
    <div className="bg-white border border-primary-200 rounded-2xl p-7 h-fit min-w-[300px]">
      {/* Contact Property */}
      <div className="flex items-center gap-5 mb-4 border border-primary-200 p-4 rounded-xl">
        <div className="flex items-center p-4 bg-primary-900 rounded-full">
          <Phone className="text-primary-50" size={15} />
        </div>
        <div>
          <p>Contact This Property</p>
          <div className="text-lg font-bold text-primary-800">
            {property?.manager?.phoneNumber || "(424) 340-5574"}
          </div>
        </div>
      </div>
      <Button
        className="w-full bg-primary-700 text-white hover:bg-primary-600 mb-2"
        onClick={handleButtonClick}
      >
        Book Appointment
      </Button>
      <Button
        className="w-full bg-[#EFBF04] text-white hover:bg-[#d6ab03] font-semibold"
        onClick={() => setIsViewingModalOpen(true)}
      >
        Book Viewing
      </Button>

      <ViewingModal
        propertyId={property?.id}
        isOpen={isViewingModalOpen}
        onClose={() => setIsViewingModalOpen(false)}
      />

      <hr className="my-4" />
      <div className="text-sm">
        <div className="text-primary-600 mb-1">Language: English, Kiswahili.</div>
        <div className="text-primary-600">
          Open by appointment on Monday - Sunday
        </div>
      </div>
    </div>
  );
};

export default ContactWidget;
