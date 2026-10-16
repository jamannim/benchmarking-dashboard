import React from 'react';
import type { TabCrossVerificationData } from '../../data/crossVerificationData';

interface Props {
  data?: TabCrossVerificationData;
  className?: string;
  defaultExpanded?: boolean;
}

/**
 * 사전 검증 완료된 교차 검증 내역으로, 사용자 페이지 노출 대상에서 전체 제외 (Rule 12 & 사용자 요청 준수)
 */
export const DualSourceVerificationSection: React.FC<Props> = () => {
  return null;
};
