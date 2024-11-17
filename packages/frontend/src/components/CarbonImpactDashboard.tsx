import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, Leaf, Users, AlertTriangle } from 'lucide-react';

const CarbonImpactDashboard = () => {
  // Sample data - in a real app, this would come from your backend
  const userData = [
    { id: 1, name: "Local Area 1", carbonFootprint: 12.5, waterUsage: 150 },
    { id: 2, name: "Local Area 2", carbonFootprint: 9.8, waterUsage: 120 },
    { id: 3, name: "Local Area 3", carbonFootprint: 15.2, waterUsage: 180 },
    { id: 4, name: "Local Area 4", carbonFootprint: 7.5, waterUsage: 90 },
  ];

  const averages = {
    carbonFootprint: userData.reduce((acc, curr) => acc + curr.carbonFootprint, 0) / userData.length,
    waterUsage: userData.reduce((acc, curr) => acc + curr.waterUsage, 0) / userData.length
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Carbon Impact Platform</h1>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span className="text-lg">{userData.length} Areas Monitored</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <span>Average Carbon Footprint</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {averages.carbonFootprint.toFixed(1)} tons CO₂e
            </div>
            <p className="text-sm text-green-600 mt-1">Per capita annual emissions</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              <span>Average Water Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {averages.waterUsage.toFixed(1)} gal/day
            </div>
            <p className="text-sm text-blue-600 mt-1">Per capita daily consumption</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Carbon Footprint by Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit=" tons" />
                  <Tooltip />
                  <Bar dataKey="carbonFootprint" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Water Usage by Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit=" gal" />
                  <Tooltip />
                  <Bar dataKey="waterUsage" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Section */}
      <Card className="bg-amber-50">
        <CardContent className="flex items-center space-x-4 py-4">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
          <div>
            <h3 className="font-semibold text-amber-800">High Usage Alert</h3>
            <p className="text-amber-700">Local Area 3 is showing above-average consumption patterns</p>
          </div>
          </CardContent>
        </Card>
      </div> 
  );
};

export default CarbonImpactDashboard;