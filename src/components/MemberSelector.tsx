"use client";

import type { TeamMember } from "../types";
import { QuantumButton } from "./ui/QuantumButton";

interface MemberSelectorProps {
	members: TeamMember[];
	selectedMembers: string[];
	onSelectionChange: (memberIds: string[]) => void;
	currentUserId: string;
}

export function MemberSelector({
	members,
	selectedMembers,
	onSelectionChange,
	currentUserId,
}: MemberSelectorProps) {
	const availableMembers = members.filter(
		(member) => member.id !== currentUserId,
	);

	const handleMemberToggle = (memberId: string) => {
		if (selectedMembers.includes(memberId)) {
			onSelectionChange(selectedMembers.filter((id) => id !== memberId));
		} else {
			onSelectionChange([...selectedMembers, memberId]);
		}
	};

	const handleSelectAll = () => {
		const allMemberIds = availableMembers.map((member) => member.id);
		onSelectionChange(allMemberIds);
	};

	const handleClearAll = () => {
		onSelectionChange([]);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="text-xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
					👥 送りたい人を選択
				</div>
				<div className="flex space-x-3">
					<QuantumButton
						onClick={handleSelectAll}
						disabled={selectedMembers.length === availableMembers.length}
						variant="primary"
						className="px-5 py-2 text-sm"
					>
						全て選択
					</QuantumButton>
					<QuantumButton
						onClick={handleClearAll}
						disabled={selectedMembers.length === 0}
						variant="secondary"
						className="px-5 py-2 text-sm"
					>
						選択解除
					</QuantumButton>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{availableMembers.map((member) => {
					const isSelected = selectedMembers.includes(member.id);
					return (
						<label
							key={member.id}
							className={`
                relative flex items-center p-5 rounded-3xl border-3 cursor-pointer transition-all transform hover:scale-105 group overflow-hidden
                ${
									isSelected
										? "bg-gradient-to-br from-orange-100/90 via-pink-100/90 to-purple-100/90 border-orange-500/70 shadow-2xl backdrop-blur-xl ring-4 ring-orange-300/30"
										: "bg-gradient-to-br from-orange-50/70 via-pink-50/70 to-purple-50/70 border-orange-300/50 hover:from-orange-100/80 hover:via-pink-100/80 hover:to-purple-100/80 hover:border-orange-400/70 shadow-xl backdrop-blur-xl hover:shadow-2xl"
								}
              `}
						>
							<div className="relative mr-4">
								<input
									type="checkbox"
									checked={isSelected}
									onChange={() => handleMemberToggle(member.id)}
									className="sr-only"
								/>
								<div
									className={`
									w-7 h-7 rounded-full border-3 transition-all duration-300 flex items-center justify-center relative overflow-hidden
									${
										isSelected
											? "bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 border-orange-500 shadow-lg"
											: "bg-white/80 border-orange-300/60 shadow-md hover:border-orange-400"
									}
								`}
								>
									{isSelected && (
										<svg
											className="w-4 h-4 text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									)}
									{isSelected && (
										<div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
									)}
								</div>
							</div>
							<div className="flex items-center">
								{member.avatar ? (
									<img
										src={member.avatar}
										alt={member.name}
										className="w-10 h-10 rounded-full mr-3"
									/>
								) : (
									<div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-full mr-4 flex items-center justify-center ring-3 ring-orange-300/30 shadow-xl relative overflow-hidden">
										<div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
										<span className="text-sm font-bold text-white relative z-10">
											{member.name.charAt(0)}
										</span>
									</div>
								)}
								<span
									className={`font-bold text-lg transition-colors ${
										isSelected
											? "bg-gradient-to-r from-orange-700 via-pink-700 to-purple-700 bg-clip-text text-transparent"
											: "text-slate-800 group-hover:text-slate-900"
									}`}
								>
									{member.name}
								</span>
							</div>
						</label>
					);
				})}
			</div>

			{selectedMembers.length > 0 && (
				<div className="text-center">
					<div className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-100/90 via-pink-100/90 to-purple-100/90 backdrop-blur-xl rounded-3xl border-3 border-orange-400/60 shadow-2xl relative overflow-hidden">
						<div className="absolute inset-0 bg-white/20 animate-pulse" />
						<span className="text-xl font-bold bg-gradient-to-r from-orange-700 via-pink-700 to-purple-700 bg-clip-text text-transparent relative z-10">
							✨️ {selectedMembers.length} 人を選択中
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
