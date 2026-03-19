interface AdSlotProps {
  format?: 'leaderboard' | 'rectangle' | 'banner';
}

const SIZES = {
  leaderboard: 'h-[90px]',
  rectangle: 'h-[250px]',
  banner: 'h-[50px]',
};

export function AdSlot({ format = 'leaderboard' }: AdSlotProps) {
  return (
    <div className={`bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl ${SIZES[format]} flex items-center justify-center text-gray-400`}>
      <p className="text-sm">광고 영역 (AdSense)</p>
    </div>
  );
}
