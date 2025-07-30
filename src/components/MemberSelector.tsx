"use client";

import type { TeamMember } from "../types";

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
				<div className="text-lg font-bold text-slate-800">
					👥 送りたい人を選んでね
				</div>
				<div className="space-x-2">
					<button
						type="button"
						onClick={handleSelectAll}
						disabled={selectedMembers.length === availableMembers.length}
						className="px-4 py-2 rounded-2xl text-sm font-semibold bg-gradient-to-r from-orange-100/80 to-pink-100/80 text-orange-700 hover:from-orange-200/80 hover:to-pink-200/80 disabled:opacity-50 transition-all transform hover:scale-105 border border-orange-200 shadow-sm backdrop-blur-sm"
					>
						全て選択
					</button>
					<button
						type="button"
						onClick={handleClearAll}
						disabled={selectedMembers.length === 0}
						className="px-4 py-2 rounded-2xl text-sm font-semibold bg-gradient-to-r from-purple-100/80 to-pink-100/80 text-purple-700 hover:from-purple-200/80 hover:to-pink-200/80 disabled:opacity-50 transition-all transform hover:scale-105 border border-purple-200 shadow-sm backdrop-blur-sm"
					>
						選択解除
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{availableMembers.map((member) => {
					const isSelected = selectedMembers.includes(member.id);
					return (
						<label
							key={member.id}
							className={`
                flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all transform hover:scale-105
                ${
									isSelected
										? "bg-gradient-to-r from-orange-100/80 to-pink-100/80 border-orange-400 shadow-xl backdrop-blur-sm"
										: "bg-gradient-to-r from-orange-50/60 to-pink-50/60 border-orange-200 hover:from-orange-50/80 hover:to-pink-50/80 hover:border-orange-300 shadow-md backdrop-blur-sm"
								}
              `}
						>
							<input
								type="checkbox"
								checked={isSelected}
								onChange={() => handleMemberToggle(member.id)}
								className="mr-3 h-5 w-5 text-orange-500 focus:ring-orange-400 border-orange-300 rounded-xl"
							/>
							<div className="flex items-center">
								{member.avatar ? (
									<img
										src={member.avatar}
										alt={member.name}
										className="w-10 h-10 rounded-full mr-3"
									/>
								) : (
									<div className="w-10 h-10 bg-slate-600 rounded-full mr-3 flex items-center justify-center">
										<span className="text-sm font-semibold text-white">
											{member.name.charAt(0)}
										</span>
									</div>
								)}
								<span className="font-medium text-slate-800">
									{member.name}
								</span>
							</div>
						</label>
					);
				})}
			</div>

			{selectedMembers.length > 0 && (
				<div className="text-center">
					<p className="inline-block px-6 py-3 bg-gradient-to-r from-orange-100/80 to-pink-100/80 text-orange-700 font-bold rounded-2xl border-2 border-orange-300 shadow-lg backdrop-blur-sm">
					✨️	{selectedMembers.length}人を選択中
					</p>
				</div>
			)}
		</div>
	);
}
