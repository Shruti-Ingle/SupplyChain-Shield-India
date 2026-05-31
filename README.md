# SupplyChain Shield India

AI-powered logistics platform that matches empty return trucks with cargo shipments across India.

## Quick Start

```bash
cd SCSI
npm install
npm run seed
npm run dev
```

Open https://supply-chain-shield-india.vercel.app/

## Demo Accounts

| Role        | Email                   | Password |
|-------------|-------------------------|----------|
| Transporter | transporter@example.com | pass     |
| Business    | business@example.com    | pass     |
| Admin       | admin@example.com       | pass     |

## Demo Flow

1. Login as Transporter - View Shipment Matches - Accept Mumbai to Ahmedabad match
2. Or login as Business - Browse Available Transporters - Book a truck
3. Both redirect to Live Tracking with simulated movement every 5 seconds
4. Login as Admin - View national sustainability metrics
