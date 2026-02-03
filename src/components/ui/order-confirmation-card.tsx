"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  CreditCard,
  Handshake,
  Clock,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** A single detail row in the confirmation card */
export interface ConfirmationDetail {
  label: string;
  value: string;
  isBold?: boolean;
  /** Optional mono font for IDs, refs, etc. */
  mono?: boolean;
}

/**
 * Flexible confirmation card — works for missions, contracts, payments, etc.
 */
interface ConfirmationCardProps {
  /** Array of detail rows to display */
  details: ConfirmationDetail[];
  /** Primary action callback */
  onAction: () => void;
  /** Optional secondary action */
  onSecondaryAction?: () => void;
  /** Card title */
  title?: string;
  /** Subtitle/description below title */
  subtitle?: string;
  /** Primary button text */
  buttonText?: string;
  /** Secondary button text */
  secondaryButtonText?: string;
  /** Custom icon — defaults to CheckCircle2 */
  icon?: React.ReactNode;
  /** Visual variant for different confirmation types */
  variant?: "success" | "pending" | "mission" | "contract" | "payment";
  /** Optional reference ID to show with copy button */
  referenceId?: string;
  /** Additional CSS classes */
  className?: string;
}

const variantConfig = {
  success: {
    icon: <CheckCircle2 className="h-12 w-12 text-lime-400" />,
    iconBg: "bg-lime-400/10",
    accentColor: "text-lime-400",
  },
  pending: {
    icon: <Clock className="h-12 w-12 text-yellow-400" />,
    iconBg: "bg-yellow-400/10",
    accentColor: "text-yellow-400",
  },
  mission: {
    icon: <FileText className="h-12 w-12 text-lime-400" />,
    iconBg: "bg-lime-400/10",
    accentColor: "text-lime-400",
  },
  contract: {
    icon: <Handshake className="h-12 w-12 text-blue-400" />,
    iconBg: "bg-blue-400/10",
    accentColor: "text-blue-400",
  },
  payment: {
    icon: <CreditCard className="h-12 w-12 text-green-400" />,
    iconBg: "bg-green-400/10",
    accentColor: "text-green-400",
  },
};

export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
  details,
  onAction,
  onSecondaryAction,
  title = "Opération confirmée",
  subtitle,
  buttonText = "Continuer",
  secondaryButtonText,
  icon,
  variant = "success",
  referenceId,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);
  const config = variantConfig[variant];

  const handleCopy = async () => {
    if (!referenceId) return;
    await navigator.clipboard.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 14 },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-live="polite"
        className={cn(
          "w-full max-w-md rounded-2xl border border-border bg-card text-card-foreground shadow-xl p-6 sm:p-8",
          className
        )}
      >
        <div className="flex flex-col items-center space-y-5 text-center">
          {/* Icon with background circle */}
          <motion.div
            variants={itemVariants}
            className={cn(
              "flex items-center justify-center rounded-full p-4",
              config.iconBg
            )}
          >
            {icon || config.icon}
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants} className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground max-w-xs">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Reference ID with copy */}
          {referenceId && (
            <motion.div variants={itemVariants}>
              <button
                onClick={handleCopy}
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg",
                  "bg-muted/50 border border-border hover:bg-muted transition-colors",
                  "text-xs font-mono text-muted-foreground"
                )}
              >
                {referenceId}
                {copied ? (
                  <Check className="h-3 w-3 text-lime-400" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </motion.div>
          )}

          {/* Details Section */}
          <motion.div
            variants={itemVariants}
            className="w-full space-y-0 pt-2"
          >
            {details.map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center justify-between py-3 text-sm",
                  index < details.length - 1 && "border-b border-border/50",
                  item.isBold
                    ? "font-semibold text-card-foreground"
                    : "text-muted-foreground"
                )}
              >
                <span>{item.label}</span>
                <span
                  className={cn(
                    item.isBold && cn("text-base", config.accentColor),
                    item.mono && "font-mono text-xs"
                  )}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="w-full space-y-2.5 pt-2">
            <Button
              onClick={onAction}
              className="w-full h-11"
              size="lg"
            >
              {buttonText}
            </Button>
            {secondaryButtonText && onSecondaryAction && (
              <Button
                onClick={onSecondaryAction}
                variant="outline"
                className="w-full h-11"
                size="lg"
              >
                {secondaryButtonText}
              </Button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Preset helpers ──────────────────────────────────────────────

/** Mission submitted confirmation */
export function MissionConfirmationCard({
  missionTitle,
  missionId,
  budget,
  deadline,
  onViewMission,
  onBackToDashboard,
}: {
  missionTitle: string;
  missionId: string;
  budget: string;
  deadline?: string;
  onViewMission: () => void;
  onBackToDashboard?: () => void;
}) {
  return (
    <ConfirmationCard
      variant="mission"
      title="Mission soumise !"
      subtitle="Votre mission est en cours de validation par notre équipe. Vous serez notifié dès qu'elle sera publiée."
      referenceId={missionId}
      details={[
        { label: "Mission", value: missionTitle },
        { label: "Budget", value: budget, isBold: true },
        ...(deadline ? [{ label: "Échéance", value: deadline }] : []),
        { label: "Statut", value: "En attente de validation" },
      ]}
      buttonText="Voir ma mission"
      onAction={onViewMission}
      secondaryButtonText="Retour au tableau de bord"
      onSecondaryAction={onBackToDashboard}
    />
  );
}

/** Contract signed confirmation */
export function ContractConfirmationCard({
  contractId,
  missionTitle,
  freelancerName,
  amount,
  onViewContract,
  onViewMission,
}: {
  contractId: string;
  missionTitle: string;
  freelancerName: string;
  amount: string;
  onViewContract: () => void;
  onViewMission?: () => void;
}) {
  return (
    <ConfirmationCard
      variant="contract"
      title="Contrat signé !"
      subtitle="Le contrat a été créé et les deux parties ont été notifiées."
      referenceId={contractId}
      details={[
        { label: "Mission", value: missionTitle },
        { label: "Freelance", value: freelancerName },
        { label: "Montant", value: amount, isBold: true },
        { label: "Statut", value: "Actif" },
      ]}
      buttonText="Voir le contrat"
      onAction={onViewContract}
      secondaryButtonText="Voir la mission"
      onSecondaryAction={onViewMission}
    />
  );
}

/** Payment confirmation */
export function PaymentConfirmationCard({
  transactionId,
  amount,
  paymentMethod,
  missionTitle,
  onViewDetails,
  onBackToDashboard,
}: {
  transactionId: string;
  amount: string;
  paymentMethod: string;
  missionTitle: string;
  onViewDetails: () => void;
  onBackToDashboard?: () => void;
}) {
  return (
    <ConfirmationCard
      variant="payment"
      title="Paiement confirmé !"
      subtitle="Le montant a été sécurisé en escrow. Il sera libéré à la validation de la mission."
      referenceId={transactionId}
      details={[
        { label: "Mission", value: missionTitle },
        { label: "Méthode", value: paymentMethod },
        {
          label: "Date",
          value: new Date().toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        { label: "Total", value: amount, isBold: true },
      ]}
      buttonText="Voir les détails"
      onAction={onViewDetails}
      secondaryButtonText="Retour au tableau de bord"
      onSecondaryAction={onBackToDashboard}
    />
  );
}