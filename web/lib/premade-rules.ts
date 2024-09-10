// funcs dealing with premade rules

import _ from "lodash";

/** premade rename rules */
export const PremadeRules:PremadeRenameRule[]=[
    {
        ruleString:"{{inc}}",
        displayText:"Increment Number",
    },
    {
        ruleString:"{{random}}",
        displayText:"Random Hash",
    },
];

/** rules keyed by rule string */
const PremadeRulesByRule:RenameRulesRuleMap=_.keyBy(
    PremadeRules,
    (rule:PremadeRenameRule):string=>{
        return rule.ruleString;
    }
);

/** find a rule by rule string in premade rules list. gives index if found */
export function findRule(rule:string):number
{
    return _.findIndex(PremadeRules,(ruleItem:PremadeRenameRule):boolean=>{
        return ruleItem.ruleString==rule;
    });
}