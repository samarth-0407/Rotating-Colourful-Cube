/**
 * Create a delayable function from a unary function.
 *
 * Useful for debouncing.
 *
 * Usage:
 * ----------------------------------------------------
 * 				// Given unary function
 * 				// `f'
 * f1 = new Delayable(f)
 * f1.delay(350) 		// milliseconds
 * f1.clearMaybe()		// clear timer if exist
 * f1.exec() 			// exec the function
 * f1.defaultDelay = 850	// update default delay
 */
class Delayable {
  timer = null
  defaultDelay=1000
  f
  constructor(f) { this.f = f }
  clearMaybe() {
    if (this.timer)
      clearTimeout(this.timer)
    this.timer = null
  }
  clear = this.cancel
  delay(t) {
    this.clearMaybe()
    this.timer = setTimeout(
      this.now.bind(this),
      t ?? this.defaultDelay
    )
  }
  now() {
    this.clearMaybe()
    this.f()
  }
}
