/**
 *
 * @param rollResult
 * @returns {{total: (*|PaymentItem|number), mod: number, hope: {stats: {start: number, entry: string}} | string | ArrayBuffer | T | SVGAnimatedString, fear: {stats: {start: number, entry: string}} | string | ArrayBuffer | T | SVGAnimatedString}}
 */
export function getDualityResult(rollResult) {
    const hope = rollResult.terms.find(term => term.options.flavor === 'hope').results[0].result
    const fear = rollResult.terms.find(term => term.options.flavor === 'fear').results[0].result
    const total = rollResult.total
    const mod = total - hope - fear
    return {hope, fear, total, mod}
}

/**
 * @param hope
 * @param fear
 * @param total
 * @param mod
 * @param label
 * @returns {string}
 */
export function buildTemplateFromDualityResult({hope, fear, total, mod, label}) {
    const withHopeStr = game.i18n.localize('DAGGERHEART.RollResults.WithHope')
    const withFearStr = game.i18n.localize('DAGGERHEART.RollResults.WithFear')
    const criticalStr = game.i18n.localize('DAGGERHEART.RollResults.Critical')
    let resultMessage;
    let resultColor;
    let textColor;
    let border;
    if (hope > fear) {
        resultMessage = `${total} ${withHopeStr}`
        resultColor = '#B0D7FF'
        textColor = '#000000'
        border = '1px solid black'
    } else if (hope < fear) {
        resultMessage = `${total} ${withFearStr}`
        resultColor = '#2D3142'
        textColor = '#FFFFFF'
        border = '1px solid black'
    } else {
        resultMessage = `${total} ${criticalStr}`
        resultColor = '#5863F8'
        textColor = '#000000'
        border = '2px solid black'
    }

    let modStr = ''
    if (mod > 0) {
        modStr = `+ ${mod}`
    } else if (mod < 0) {
        modStr = `- ${mod}`
    } else {
        modStr = '0'
    }

    return `
      <div class="message-content">
        <div class="dice-roll">
          <div class="dice-result">
            <h4 class="dice-formula" style="
              background-color: ${resultColor}; 
              color: ${textColor}; 
              border: ${border};
              font-size: 1.25rem;
              font-weight: bold;
            ">
              ${resultMessage}
            </h4>
            <div class="dice-tooltip">
              <section class="tooltip-part">
                <div class="dice" style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 8px">
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <span>Hope</span>
                    <ol class="dice-rolls">
                      <li class="roll die d12">${hope}</li>
                    </ol>
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <span>Fear</span>
                    <ol class="dice-rolls">
                      <li class="roll die d12">${fear}</li>
                    </ol>
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <span>${label}</span>
                    <ol class="dice-rolls">
                      <li class="roll die d6">${modStr}</li>
                    </ol>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    `
}
