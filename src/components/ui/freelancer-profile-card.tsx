import * as React from "react";
import { motion } from "framer-motion";
import { Star, Bookmark } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

/**
 * Configurable stat item for the stats bar.
 */
export interface StatConfig {
  icon?: React.ElementType;
  value: string | number;
  label: string;
}

/**
 * Props for the FreelancerProfileCard component.
 */
interface FreelancerProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The user's full name. */
  name: string;
  /** The user's job title or role. */
  title: string;
  /** URL for the user's avatar image. */
  avatarSrc: string;
  /** URL for the card's banner image. */
  bannerSrc: string;
  /** Configurable stats bar. Falls back to legacy rating/duration/rate if not provided. */
  stats?: StatConfig[];
  /** Legacy: The user's rating (e.g., 4.0). Use `stats` instead. */
  rating?: number;
  /** Legacy: A string describing the project duration. Use `stats` instead. */
  duration?: string;
  /** Legacy: A string for the user's rate. Use `stats` instead. */
  rate?: string;
  /** Skills/tools displayed in the card header. Prefer 'skills' for semantic clarity. */
  tools?: React.ReactNode;
  /** Skills displayed in the card header. Alias for 'tools'. */
  skills?: React.ReactNode;
  /** Badges shown as React nodes near the name (e.g., Badge components). */
  badges?: React.ReactNode;
  /** Optional click handler for the action button. */
  onGetInTouch?: () => void;
  /** Optional click handler for the bookmark icon. */
  onBookmark?: () => void;
  /** Custom button label. Defaults to "Get in touch". */
  buttonLabel?: string;
  /** Hide the action button entirely. */
  hideButton?: boolean;
  /** Hide the bookmark icon. */
  hideBookmark?: boolean;
  /** Optional additional class names. */
  className?: string;
}

// Animation variants for Framer Motion
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    scale: 1.03,
    transition: { duration: 0.3 },
  },
};

const contentVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3, // Start staggering after card loads
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/**
 * A reusable, animated profile card component.
 */
export const FreelancerProfileCard = React.forwardRef<
  HTMLDivElement,
  FreelancerProfileCardProps
>(
  (
    {
      className,
      name,
      title,
      avatarSrc,
      bannerSrc,
      stats,
      rating,
      duration,
      rate,
      tools,
      skills,
      badges,
      onGetInTouch,
      onBookmark,
      buttonLabel = "Get in touch",
      hideButton = false,
      hideBookmark = false,
      ...props
    },
    ref
  ) => {
    const avatarName = name
      .split(" ")
      .map((n) => n[0])
      .join("");

    // Backward compatibility: convert legacy props to stats if stats not provided
    const finalStats: StatConfig[] = stats || [
      ...(rating !== undefined ? [{ icon: Star, value: rating.toFixed(1), label: "rating" }] : []),
      ...(duration !== undefined ? [{ value: duration, label: "duration" }] : []),
      ...(rate !== undefined ? [{ value: rate, label: "rate" }] : []),
    ];

    // Use skills if provided, otherwise fall back to tools
    const displaySkills = skills || tools;

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative w-full max-w-sm overflow-hidden rounded-2xl bg-card shadow-lg",
          className
        )}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        {...props}
      >
        {/* Banner Image */}
        <div className="h-32 w-full">
          <img
            src={bannerSrc}
            alt={`${name}'s banner`}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Bookmark Button */}
        {!hideBookmark && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-4 h-9 w-9 rounded-lg bg-background/50 backdrop-blur-sm text-card-foreground/80 hover:bg-background/70"
            onClick={onBookmark}
            aria-label="Bookmark profile"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        )}

        {/* Avatar (overlaps banner) */}
        <div className="absolute left-1/2 top-32 -translate-x-1/2 -translate-y-1/2">
          <Avatar className="h-20 w-20 border-4 border-card">
            <AvatarImage src={avatarSrc} alt={name} />
            <AvatarFallback>{avatarName}</AvatarFallback>
          </Avatar>
        </div>

        {/* Content Area */}
        <motion.div
          className="px-6 pb-6 pt-12" // pt-12 to clear avatar
          variants={contentVariants}
        >
          {/* Name, Title, Badges, and Skills */}
          <motion.div
            className="mb-4 flex items-start justify-between gap-3"
            variants={itemVariants}
          >
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-card-foreground">
                {name}
              </h2>
              <p className="text-sm text-muted-foreground">{title}</p>
              {badges && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {badges}
                </div>
              )}
            </div>
            {displaySkills && (
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className="flex gap-1.5 flex-wrap justify-end">{displaySkills}</div>
                <span className="text-xs text-muted-foreground">Skills</span>
              </div>
            )}
          </motion.div>

          {/* Stats */}
          {finalStats.length > 0 && (
            <motion.div
              className="my-6 flex items-center justify-around rounded-lg border border-border bg-background/30 p-4"
              variants={itemVariants}
            >
              {finalStats.map((stat, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider />}
                  <StatItem
                    icon={stat.icon}
                    value={stat.value}
                    label={stat.label}
                  />
                </React.Fragment>
              ))}
            </motion.div>
          )}

          {/* Action Button */}
          {!hideButton && (
            <motion.div variants={itemVariants}>
              <Button className="w-full" size="lg" onClick={onGetInTouch}>
                {buttonLabel}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  }
);
FreelancerProfileCard.displayName = "FreelancerProfileCard";

// Internal StatItem component
const StatItem = ({
  icon: Icon,
  value,
  label,
}: {
  icon?: React.ElementType;
  value: string | number;
  label: string;
}) => (
  <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
    <div className="flex items-center gap-1">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      <span className="text-base font-semibold text-card-foreground">
        {value}
      </span>
    </div>
    <span className="text-xs capitalize text-muted-foreground">{label}</span>
  </div>
);

// Internal Divider component
const Divider = () => <div className="h-10 w-px bg-border" />;
