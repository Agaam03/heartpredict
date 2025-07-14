export type Prediction = {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  date: string;
  time: string;
  rfPrediction: string;
  nnPrediction: string;
  xgbPrediction: string;
  stackingPrediction: string;
  rfProbability: number;
  nnProbability: number;
  xgbProbability: number;
  stackingConfidence: number;
  finalResult: string;
};

interface PredictionById {
id: string;
userId: string;
prediction: number;
prediction_label: string;
stackingPrediction: number;
confidence: number;
risk_level: string;
advice: string;
model_probabilities: {
  random_forest: number;
  ffnn: number;
  xgboost: number;
};
inputData: any;
createdAt: Date;
}