// components/CheckoutStepper.jsx
import CartStep from "./CartStep";
import AddressPaymentStep from "./AddressPaymentStep";
import PaymentConfirmationStep from "./PaymentConfirmationStep";

export default function CheckoutStepper({
  currentStep,
  cart,
  selectedAddress,
  selectedPayment,
  setSelectedAddress,
  setSelectedPayment,
  updateQuantity,
  cartError,
  removeItem,
  nextStep,
  cartLoading,
  prevStep,
  distanceDetails,
  setDistanceDetails,
}) {
  switch (currentStep) {
    case 1:
      return (
        <CartStep
          cart={cart}
          cartLoading={cartLoading}
          cartError={cartError}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          nextStep={nextStep}
        />
      );
    case 2:
      return (
        <AddressPaymentStep
          selectedAddress={selectedAddress}
          selectedPayment={selectedPayment}
          setSelectedAddress={setSelectedAddress}
          setSelectedPayment={setSelectedPayment}
          prevStep={prevStep}
          nextStep={nextStep}
          distanceDetails={distanceDetails}
          setDistanceDetails={setDistanceDetails}
        />
      );
    case 3:
      return (
        <PaymentConfirmationStep
          cart={cart}
          selectedAddress={selectedAddress}
          selectedPayment={selectedPayment}
          prevStep={prevStep}
          distanceDetails={distanceDetails}
        />
      );
    default:
      return <CartStep cart={cart} total={total} nextStep={nextStep} />;
  }
}
