import React from 'react';
import CarbonImpactDashboard from '../components/CarbonImpactDashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto"> 
        <CarbonImpactDashboard></CarbonImpactDashboard>
      </div>
    </div>
  );
}