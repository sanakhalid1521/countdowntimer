import CountdownTimer from './componenets/CountdownTimer';  // Adjust the path as needed


export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">  {/* Change background to see if it applies */}
      <div>
        <h1 className="text-4xl font-bold text-center mb-4">Countdown Timer</h1>
        <CountdownTimer />
      </div>
    </div>
  );
}
