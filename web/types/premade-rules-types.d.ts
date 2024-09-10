/** rename rules keyed by their rule string for fast finding
 *  key: the rule
 *  val: rule string */
type RenameRulesRuleMap=Record<string,PremadeRenameRule>

/** premade rename rule selectable by user */
interface PremadeRenameRule
{
    ruleString:string
    displayText:string
}