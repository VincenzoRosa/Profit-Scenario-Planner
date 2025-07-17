# ProfitMax - Dynamic tROAS Optimization App

A comprehensive E-commerce profitability application that dynamically calculates optimal target ROAS (Return on Ad Spend) for SEA campaigns based on overall business performance.

## 🚀 Features

### Core Functionality
- **Dynamic tROAS Calculation**: Automatically recommends optimal tROAS based on business health metrics
- **Business Health Scoring**: Multi-factor analysis including revenue growth, margins, cash reserves, and inventory turnover
- **Scenario Planning**: Conservative, Balanced, and Aggressive tROAS strategies
- **Real-time Visualizations**: Interactive charts and matrices showing optimization opportunities

### Key Components

#### 1. Business Health Inputs (Left Panel)
- Total Monthly Revenue
- Month-over-Month Revenue Growth
- Gross Margin Percentage
- Operating Expense Ratio
- Cash Reserve Ratio
- Inventory Turnover Rate
- Current SEA Campaign Metrics
- Business Context (Season, Competition, Stage)

#### 2. tROAS Opportunity Matrix (Center)
- Heat map visualization showing recommended tROAS zones
- Color-coded regions: Green (Aggressive), Yellow (Balanced), Red (Conservative)
- Current position marker with historical path
- Real-time updates based on business metrics

#### 3. Profit Impact Simulator (Center)
- Profit curves for current, improved (+10%), and declined (-10%) business scenarios
- Safe to expand vs. risky territory zones
- Current vs. recommended tROAS comparison

#### 4. Strategy Dashboard (Right Panel)
- Recommended tROAS with reasoning
- Projected impact on spend, revenue, and profit
- Market opportunity scoring
- Action buttons for implementation

#### 5. Supporting Visualizations
- **tROAS Efficiency Curve**: Shows revenue efficiency at different tROAS levels
- **Business Health Gauge**: Speedometer-style health score visualization
- **Risk/Reward Matrix**: Scatter plot of tROAS options

#### 6. Smart Alerts System
- Automated optimization opportunities
- Margin compression warnings
- Market opportunity alerts
- Historical performance tracking

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Custom SVG visualizations
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## 📊 Calculation Logic

### Business Health Score (0-100)
```
health_score = (
  revenue_growth_score * 0.3 +
  profit_margin_score * 0.3 +
  cash_reserve_score * 0.2 +
  inventory_turnover_score * 0.2
)
```

### Base tROAS Calculation
- **Health Score > 80**: Aggressive (tROAS 2.0)
- **Health Score > 60**: Balanced (tROAS 3.0)
- **Health Score > 40**: Conservative (tROAS 4.0)
- **Health Score ≤ 40**: Defensive (tROAS 5.0)

### Context Adjustments
- **Seasonal**: High season (-0.5), Low season (+0.5)
- **Competition**: High competition with good health (-0.3)
- **Growth Stage**: Growth stage with good cash reserves (-0.4)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd profitmax

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## 📈 Usage

1. **Input Business Metrics**: Enter your current business performance data in the left panel
2. **Review Recommendations**: The system will automatically calculate and display recommended tROAS
3. **Explore Scenarios**: Use the scenario planning toggles to see different approaches
4. **Analyze Visualizations**: Review the opportunity matrix and profit impact simulator
5. **Implement Strategy**: Use the action buttons to apply recommended tROAS settings

## 🎯 Key Benefits

- **Data-Driven Decisions**: tROAS recommendations based on comprehensive business analysis
- **Risk Management**: Visual identification of safe vs. risky tROAS ranges
- **Market Responsiveness**: Automatic adjustments for seasonal and competitive factors
- **Profit Optimization**: Maximize profitability while maintaining growth
- **Historical Tracking**: Monitor performance against recommendations over time

## 🔧 Customization

The application is built with modular components and can be easily customized:

- **Calculation Logic**: Modify `src/lib/calculations.ts` for different algorithms
- **Visualizations**: Update chart components in `src/components/`
- **Styling**: Customize Tailwind classes for different themes
- **Data Sources**: Integrate with external APIs for real-time data

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**ProfitMax** - Transforming tROAS from a campaign-level tactic to a strategic business decision.
