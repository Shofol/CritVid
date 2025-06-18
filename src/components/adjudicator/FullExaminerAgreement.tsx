import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import ExaminerAgreement from "./ExaminerAgreement";
import ExaminerAgreementPart2 from "./ExaminerAgreementPart2";
import ExaminerAgreementPart3 from "./ExaminerAgreementPart3";

interface FullExaminerAgreementProps {
  onAccept: (data: { fullName: string; agreed: boolean; date: string }) => void;
  onCancel: () => void;
}

const FullExaminerAgreement: React.FC<FullExaminerAgreementProps> = ({
  onAccept,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = React.useState("part1");
  const [agreed, setAgreed] = React.useState(false);
  const [fullName, setFullName] = React.useState("");
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAccept({ fullName, agreed, date: today });
  };

  // Function to handle the confirm button click on the last page
  const handleConfirm = () => {
    // Set the agreed checkbox to true when confirming
    setAgreed(true);
    // Close the dialog by calling onAccept
    onAccept({ fullName, agreed: true, date: today });
  };

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto bg-white rounded-lg shadow-lg text-gray-900">
      {/* <h2 className="text-2xl font-bold text-center text-gray-900">
        VidCrit Examiner Agreement
      </h2> */}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="part1">Sections 1-2</TabsTrigger>
          <TabsTrigger value="part2">Sections 3-6</TabsTrigger>
          <TabsTrigger value="part3">Sections 7-10</TabsTrigger>
        </TabsList>

        <TabsContent value="part1" className="mt-0">
          <ExaminerAgreement />
          <div className="flex justify-end mt-4 pb-4">
            <Button onClick={() => setActiveTab("part2")}>Next</Button>
          </div>
        </TabsContent>

        <TabsContent value="part2" className="mt-0">
          <ExaminerAgreementPart2 />
          <div className="flex justify-between mt-4 pb-4">
            <Button variant="outline" onClick={() => setActiveTab("part1")}>
              Previous
            </Button>
            <Button onClick={() => setActiveTab("part3")}>Next</Button>
          </div>
        </TabsContent>

        <TabsContent value="part3" className="mt-0">
          <ExaminerAgreementPart3 />
          <div className="flex justify-between mt-4 pb-4">
            <Button variant="outline" onClick={() => setActiveTab("part2")}>
              Previous
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="fullName" className="text-gray-900">
            Full Name
          </Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Enter your full legal name"
            className="text-gray-900 bg-white"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="agreement"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            required
          />
          <Label htmlFor="agreement" className="text-sm text-gray-800">
            I have read and agree to the VidCrit Examiner Agreement. I
            understand that checking this box constitutes a legal signature.
          </Label>
        </div>

        <div className="flex justify-end space-x-4 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!agreed || !fullName}>
            Accept Agreement
          </Button>
        </div>
      </form> */}
    </div>
  );
};

export default FullExaminerAgreement;
