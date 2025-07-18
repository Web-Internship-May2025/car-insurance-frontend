import React, { useState } from "react";
import { Stepper, Step, StepLabel, Button } from "@mui/material";
import SubscriberTable from "../views/subscribers/SubscriberTable";

const FindCar = () => <div>Find or add a car content</div>;
const FindDriver = () => <div>Find or add a driver content</div>;
const Tarification = () => <div>Tarification (choose payment packet) content</div>;
const Confirmation = () => <div>Confirmation and generating offer content</div>;
const Payment = () => <div>Payment (Cheque, Card, Cash) content</div>;
const GenerateReport = () => <div>Generate report and policy content</div>;
const SendToMail = () => <div>Send to mail confirmation content</div>;

const steps = [
  { label: "Find or Add Subscriber", content: <SubscriberTable /> },
  { label: "Find or Add Car", content: <FindCar /> },
  { label: "Find or Add Driver", content: <FindDriver /> },
  { label: "Tarification (choose payment packet)", content: <Tarification /> },
  { label: "Confirmation and Generating Offer", content: <Confirmation /> },
  { label: "Payment (Cheque, Card, Cash)", content: <Payment /> },
  { label: "Generate Report and Policy", content: <GenerateReport /> },
  { label: "Sent to Mail", content: <SendToMail /> },
];

const PolicyCreationStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((old) => Math.min(old + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((old) => Math.max(old - 1, 0));
  };

return (
  <div>
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((step) => (
        <Step key={step.label}>
          <StepLabel>{step.label}</StepLabel>
        </Step>
      ))}
    </Stepper>

    <div style={{ marginTop: 20, minHeight: 300 }}>
      {steps[activeStep]?.content}
    </div>

    <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
      <Button disabled={activeStep === 0} onClick={handleBack}>
        Previous
      </Button>
      <Button disabled={activeStep === steps.length - 1} onClick={handleNext}>
        Next
      </Button>
    </div>
  </div>
);
};

export default PolicyCreationStepper;