import React, { useCallback, useEffect } from "react";
import RulesStore from "./PasswordCheckListHelper";
import { Typography } from "@mui/material";

interface IPasswordCheckList {
    password: string;
    passwordConfirm: string;
    icons: {
        success?: React.ElementType;
        error?: React.ElementType;
        default?: React.ElementType;
    };
    options: object;
    callBackFromIPasswordCheckList?: (res: { isAllRulesTrue: boolean }) => void;
}

const PasswordCheckList = ({
    password,
    passwordConfirm,
    icons,
    options,
    callBackFromIPasswordCheckList
}: IPasswordCheckList) => {
    const activeRules = useCallback(
        () =>
            new (RulesStore as any)({
                payload: {
                    password,
                    passwordConfirm
                },
                ...options
            }).getActiveRules(),
        [password, passwordConfirm, options]
    )();

    useEffect(() => {
        const isAllValid = Object.values(activeRules).every(
            (item: any) => item.valid,
        );

        if (callBackFromIPasswordCheckList) {
            callBackFromIPasswordCheckList({ isAllRulesTrue: isAllValid });
        }
    }, [activeRules]);

    return (
        <div className="password-checklist">
            {Object.keys(activeRules).map(
                (activeRuleKey: string, activeRuleIndex: number) => {
                    const Icon = (activeRules[activeRuleKey].valid
                        ? icons?.success
                        : icons?.error) as React.ElementType;
                    const IconDefault = icons?.default as React.ElementType;
                    return (
                        <div
                            key={activeRuleIndex.toString()}
                            className={`flex flex-row password-checklist__item${password || passwordConfirm
                                ? `${activeRules[activeRuleKey].valid
                                    ? " is-success"
                                    : " is-wrong"
                                }`
                                : ""
                                }`}
                        >
                            {(password || passwordConfirm) && Icon ? (
                                <div className=" pr-3 pt-1">
                                    <Icon />
                                </div>
                            ) : (
                                <div className="  pr-3 pt-1">
                                    <IconDefault />
                                </div>
                            )}
                            <Typography sx={{ display: "flex", alignItems: "center", gap: "6px" }} className="text-xs font-normal opacity-70">
                                {activeRules[activeRuleKey].msg}
                            </Typography>
                        </div>
                    );
                }
            )}
        </div>
    );
};

export default PasswordCheckList;
