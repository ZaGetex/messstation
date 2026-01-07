## Multi-Sensor Card Example

This guide explains how to use the multi-sensor card feature, which allows you to group multiple related sensors into one larger card that displays all their values together.

---

## Overview

The multi-sensor card is a special card component that displays multiple sensor readings in a single, larger card. This is useful for grouping related sensors from a specific station or monitoring system (e.g., water quality sensors, weather station sensors, etc.).

**Example Use Case:**
Instead of showing three separate small cards for water temperature, pH, and CO₂, you can combine them into one larger card titled "Water Monitoring Station" that displays all three values side-by-side.

---

## How It Works

The multi-sensor card works by:

1. **Filtering sensors** from the regular card grid that are designated for the multi-sensor card
2. **Grouping them** into a single larger card component
3. **Displaying each sensor** with its icon, title, value, and update status in a grid layout

The multi-sensor card:
- Spans **2 columns** on large screens (instead of 1 like regular cards)
- Automatically arranges sensors in a responsive grid (1 column on mobile, 3 columns on desktop)
- Each sensor maintains its individual styling (icon colors, hover effects, etc.)
- Shows the same update indicators as regular cards

---

## Configuration

### Step 1: Define Sensors for the Multi-Sensor Card

In `src/app/page.tsx`, locate the multi-sensor card configuration section:

```typescript
// --- MULTI-SENSOR CARD CONFIGURATION ---
// Define which sensors should be grouped in the multi-sensor card
const multiSensorCardSensors = ["water_temperature", "ph", "co2"];
```

Simply add or remove sensor IDs from this array to control which sensors appear in the multi-sensor card.

**Important:** These sensors will be automatically excluded from the regular card grid.

### Step 2: Customize the Card Title

The card title is set when rendering the `MultiSensorCard` component. In `src/app/page.tsx`, find where the component is rendered:

```typescript
{multiSensorCardData.length > 0 && (
  <MultiSensorCard
    title={
      language === "de"
        ? "Wassermessstation"
        : "Water Monitoring Station"
    }
    sensors={multiSensorCardData}
  />
)}
```

Update the title strings to match your station or sensor group name.

---

## Example Configuration

Here's a complete example showing how to configure a multi-sensor card for a water quality monitoring station:

### 1. Add Sensors to `sensorConfig.ts`

First, ensure your sensors are defined in `src/lib/sensorConfig.ts`:

```typescript
{
  sensorId: "water_temperature",
  title: "Wassertemperatur",
  titleEn: "Water Temperature",
  unit: "°C",
  icon: Waves,
  // ... other config options
},
{
  sensorId: "ph",
  title: "pH-Wert",
  titleEn: "pH Scale",
  unit: "",
  icon: Activity,
  // ... other config options
},
{
  sensorId: "co2",
  title: "CO₂",
  titleEn: "CO₂",
  unit: "ppm",
  icon: Cloud,
  // ... other config options
}
```

### 2. Configure in `page.tsx`

```typescript
// Define which sensors go in the multi-sensor card
const multiSensorCardSensors = ["water_temperature", "ph", "co2"];

// ... later in the JSX:

<MultiSensorCard
  title={
    language === "de"
      ? "Wassermessstation"
      : "Water Monitoring Station"
  }
  sensors={multiSensorCardData}
/>
```

### 3. Result

The multi-sensor card will appear in the dashboard grid, displaying all three sensors (water temperature, pH, and CO₂) in one larger card. The sensors will automatically be excluded from appearing as individual cards.

---

## Customization

### Styling

The multi-sensor card uses the same styling system as regular cards. Each sensor maintains its individual styling properties from `sensorConfig.ts`:
- Icon colors
- Hover text colors
- Border and shadow effects

The card itself uses a consistent backdrop-blur design that matches the rest of the dashboard.

### Layout

By default, the multi-sensor card:
- Uses 3 columns on desktop (`sm:grid-cols-3`)
- Collapses to 1 column on mobile
- Spans 2 columns in the main grid on large screens

To change the layout, edit `src/components/MultiSensorCard.tsx`:

```typescript
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
  {/* Change sm:grid-cols-3 to adjust desktop columns */}
</div>
```

---

## Component Structure

The `MultiSensorCard` component (`src/components/MultiSensorCard.tsx`) accepts:

- **`title`**: The card title (string)
- **`sensors`**: Array of sensor objects containing:
  - `config`: The sensor configuration from `sensorConfig`
  - `value`: Formatted sensor value (string)
  - `lastUpdated`: Timestamp of last update (Date)
  - `timeStatus`: Status object with `color` and `text` properties

---

## Tips

1. **Group Related Sensors**: Use the multi-sensor card for sensors that are logically related (same station, same monitoring system, etc.)

2. **Keep It Balanced**: 2-4 sensors work best in a multi-sensor card. Too many sensors can make the card cluttered.

3. **Consistent Naming**: Use descriptive station or system names for the card title that make it clear what the sensors represent.

4. **Test Responsive Layout**: Make sure your multi-sensor card looks good on mobile devices, as the layout changes significantly on smaller screens.

---

## Example: Multiple Multi-Sensor Cards

If you want to create multiple multi-sensor cards for different stations, you can extend the component to support multiple groups. However, the current implementation supports one multi-sensor card. To add more, you would need to modify `page.tsx` to create multiple `MultiSensorCard` components with different sensor groups.







