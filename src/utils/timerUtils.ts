import { TimerPhase } from '../types';

/**
 * Format seconds to MM:SS display format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(Math.abs(seconds) / 60);
  const remainingSeconds = Math.floor(Math.abs(seconds) % 60);
  const sign = seconds < 0 ? '-' : '';

  return `${sign}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Convert MM:SS string to seconds
 */
export function parseTime(timeString: string): number {
  const parts = timeString.split(':');
  if (parts.length !== 2) return 0;

  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;

  return minutes * 60 + seconds;
}

/**
 * Calculate warning threshold time
 */
export function getWarningTime(totalTime: number, threshold: number): number {
  return (totalTime * threshold) / 100;
}

/**
 * Check if time is in warning zone
 */
export function isWarningTime(currentTime: number, totalTime: number, threshold: number): boolean {
  const warningTime = getWarningTime(totalTime, threshold);
  return currentTime <= warningTime && currentTime > 0;
}

/**
 * Check if time is in critical zone (< 10% of total time)
 */
export function isCriticalTime(currentTime: number, totalTime: number): boolean {
  const criticalTime = getWarningTime(totalTime, 10);
  return currentTime <= criticalTime && currentTime > 0;
}

/**
 * Get timer color based on time remaining
 */
export function getTimerColor(currentTime: number, totalTime: number, threshold: number): string {
  if (currentTime <= 0) return '#f44336'; // Red for overtime
  if (isCriticalTime(currentTime, totalTime)) return '#ff9800'; // Orange for critical
  if (isWarningTime(currentTime, totalTime, threshold)) return '#ffc107'; // Yellow for warning
  return '#4caf50'; // Green for normal
}

/**
 * Calculate the duration between two timestamps
 */
export function calculateDuration(startTime: number, endTime: number = Date.now()): number {
  return Math.floor((endTime - startTime) / 1000);
}

/**
 * Generate a unique ID for timers
 */
export function generateTimerId(): string {
  return `timer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}