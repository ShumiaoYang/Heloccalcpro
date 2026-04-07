import React from 'react';
import {
  ScenarioActionPage,
  ScenarioCashFlowPage,
  ScenarioExecutivePage,
  ScenarioWarningPage,
} from '../components/scenario-pages';

interface ScenarioTemplateConfig {
  executive: {
    title: string;
    sectionTitle: string;
    coreCopy: string;
    secondaryCopy?: string;
    metrics?: Array<{ label: string; value: string }>;
  };
  cashFlow: {
    title: string;
    sectionTitle: string;
    coreCopy: string;
    visualType: 'bar' | 'pie';
    beforeLabel: string;
    afterLabel: string;
    beforeValue: number;
    afterValue: number;
    secondaryCopy?: string;
  };
  warning: {
    title: string;
    sectionTitle: string;
    warningTitle: string;
    coreCopy: string;
    secondaryCopy?: string;
  };
  action: {
    title: string;
    sectionTitle: string;
    coreCopy: string;
    steps: string[];
  };
}

export const ScenarioTemplateBase: React.FC<{ config: ScenarioTemplateConfig }> = ({ config }) => {
  return (
    <>
      <ScenarioExecutivePage {...config.executive} />
      <ScenarioCashFlowPage {...config.cashFlow} />
      <ScenarioWarningPage {...config.warning} />
      <ScenarioActionPage {...config.action} />
    </>
  );
};

