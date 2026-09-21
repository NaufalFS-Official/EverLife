/**
 * Pemetaan Ikon Teroptimasi & Tree-Shaken (Lucide Icons MIT) EverLife (v1.0-SMA).
 * Sumber: Game Blueprint Bagian S6 dan assetManifest.ts.
 * Direktif D5: <300 baris. Direktif D6: 100% strict type-safe, nol any.
 */

import React from 'react';
import {
  Heart,
  Smile,
  Users,
  BookOpen,
  Coins,
  PlusCircle,
  Settings,
  LucideProps,
} from 'lucide-react';
import { IconId } from '../../contracts/assetManifest';

export const GAME_ICONS: Record<IconId, React.FC<LucideProps>> = {
  'icon-heart': Heart,
  'icon-smile': Smile,
  'icon-users': Users,
  'icon-book': BookOpen,
  'icon-coins': Coins,
  'icon-calendar': PlusCircle,
  'icon-settings': Settings,
};

export {
  Heart,
  Smile,
  Users,
  BookOpen,
  Coins,
  PlusCircle,
  Settings,
};
