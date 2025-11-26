/**
 * Forecasting Module using TensorFlow.js
 * Provides statistical forecasting for trade data predictions
 */

import * as tf from '@tensorflow/tfjs';

export interface ForecastResult {
  year: string;
  exports: number;
  imports: number;
  confidence: number;
}

export interface ChartDataPoint {
  year: string;
  exports: number;
  imports: number;
}

/**
 * Simple Linear Regression Forecasting
 * Predicts future trade values based on historical trends
 */
export async function forecastTradeData(
  historicalData: ChartDataPoint[],
  yearsToPredict: number = 2
): Promise<ForecastResult[]> {
  try {
    // Prepare data for TensorFlow
    const years = historicalData.map((d, i) => i);
    const exports = historicalData.map((d) => d.exports);
    const imports = historicalData.map((d) => d.imports);

    // Create tensors
    const xTensor = tf.tensor2d(years, [years.length, 1]);
    const yExportsTensor = tf.tensor2d(exports, [exports.length, 1]);
    const yImportsTensor = tf.tensor2d(imports, [imports.length, 1]);

    // Train linear regression models
    const exportsModel = await trainLinearModel(xTensor, yExportsTensor);
    const importsModel = await trainLinearModel(xTensor, yImportsTensor);

    // Make predictions
    const predictions: ForecastResult[] = [];
    const lastYearIndex = years.length - 1;
    const lastYear = parseInt(historicalData[historicalData.length - 1].year);

    for (let i = 1; i <= yearsToPredict; i++) {
      const futureIndex = lastYearIndex + i;
      const futureYear = lastYear + i;

      const xFuture = tf.tensor2d([futureIndex], [1, 1]);

      const exportPrediction = exportsModel.predict(xFuture) as tf.Tensor;
      const importPrediction = importsModel.predict(xFuture) as tf.Tensor;

      const exportValue = (await exportPrediction.data())[0];
      const importValue = (await importPrediction.data())[0];

      // Calculate confidence based on recent trend consistency (simplified)
      const confidence = calculateConfidence(historicalData, i);

      predictions.push({
        year: futureYear.toString(),
        exports: Math.round(exportValue),
        imports: Math.round(importValue),
        confidence: confidence,
      });

      // Clean up tensors
      xFuture.dispose();
      exportPrediction.dispose();
      importPrediction.dispose();
    }

    // Clean up tensors
    xTensor.dispose();
    yExportsTensor.dispose();
    yImportsTensor.dispose();
    exportsModel.dispose();
    importsModel.dispose();

    return predictions;
  } catch (error) {
    console.error('Error in forecasting:', error);

    // Fallback: Simple trend-based prediction
    return simpleForecast(historicalData, yearsToPredict);
  }
}

/**
 * Train a simple linear regression model
 */
async function trainLinearModel(x: tf.Tensor2D, y: tf.Tensor2D): Promise<tf.Sequential> {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ units: 1, inputShape: [1] })
    ]
  });

  model.compile({
    optimizer: tf.train.adam(0.1),
    loss: 'meanSquaredError'
  });

  // Train the model
  await model.fit(x, y, {
    epochs: 100,
    verbose: 0,
    shuffle: true
  });

  return model;
}

/**
 * Calculate confidence level based on trend consistency
 * Higher confidence for stable trends, lower for volatile data
 */
function calculateConfidence(data: ChartDataPoint[], yearsAhead: number): number {
  // Get last 5 years of data
  const recentData = data.slice(-5);

  // Calculate volatility (simplified standard deviation)
  const totalValues = recentData.map(d => d.exports + d.imports);
  const mean = totalValues.reduce((a, b) => a + b, 0) / totalValues.length;
  const variance = totalValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / totalValues.length;
  const stdDev = Math.sqrt(variance);

  // Coefficient of variation (lower is more stable)
  const cv = stdDev / mean;

  // Base confidence decreases with prediction distance
  let baseConfidence = 85 - (yearsAhead - 1) * 10; // 85% for year 1, 75% for year 2

  // Adjust based on volatility
  const volatilityPenalty = Math.min(cv * 100, 20); // Max 20% penalty
  const confidence = Math.max(baseConfidence - volatilityPenalty, 50);

  return Math.round(confidence);
}

/**
 * Simple fallback forecast using moving average and growth rate
 */
function simpleForecast(
  historicalData: ChartDataPoint[],
  yearsToPredict: number
): ForecastResult[] {
  const lastYear = parseInt(historicalData[historicalData.length - 1].year);
  const recentData = historicalData.slice(-3); // Last 3 years

  // Calculate average growth rate
  const exportGrowth = calculateAverageGrowth(recentData.map(d => d.exports));
  const importGrowth = calculateAverageGrowth(recentData.map(d => d.imports));

  const predictions: ForecastResult[] = [];
  let lastExport = historicalData[historicalData.length - 1].exports;
  let lastImport = historicalData[historicalData.length - 1].imports;

  for (let i = 1; i <= yearsToPredict; i++) {
    lastExport = lastExport * (1 + exportGrowth);
    lastImport = lastImport * (1 + importGrowth);

    predictions.push({
      year: (lastYear + i).toString(),
      exports: Math.round(lastExport),
      imports: Math.round(lastImport),
      confidence: 75 - (i - 1) * 10, // Decreasing confidence
    });
  }

  return predictions;
}

/**
 * Calculate average growth rate from a series of values
 */
function calculateAverageGrowth(values: number[]): number {
  if (values.length < 2) return 0.05; // Default 5% growth

  const growthRates = [];
  for (let i = 1; i < values.length; i++) {
    const growth = (values[i] - values[i - 1]) / values[i - 1];
    growthRates.push(growth);
  }

  const avgGrowth = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;

  // Cap growth rate at reasonable bounds
  return Math.max(Math.min(avgGrowth, 0.20), -0.15); // Between -15% and +20%
}

/**
 * Calculate confidence intervals for predictions
 */
export function calculateConfidenceInterval(
  prediction: number,
  confidence: number
): { lower: number; upper: number } {
  const margin = prediction * ((100 - confidence) / 100);

  return {
    lower: Math.round(prediction - margin),
    upper: Math.round(prediction + margin),
  };
}
