// QUATERNION CLASS DESCRIPTION
/*
	The Quaternion class will 4-component structure to represent and apply rotations.
*/

// QUATERNION CLASS FIELDS:
//		w (numerical) : real component
//		x (numerical) : x-axis component
//		y (numerical) : y-axis component
//		z (numerical) : z-axis component

export class Quaternion
{
	// "theta" is how far to turn, in radians
	// "x y z" are the axis of rotation
	// "normalized" denotes whether the input axis "x y z" has been normalized already
	// if "normalized" is false, then the constructor will need to normalize the axis
	// should set components "this.w, this.x, this.y, this.z" as detailed in slides
	constructor(theta=0, x=1, y=0, z=0, normalized=false)
	{
		//TODO: done
		if (!normalized) {
			var l = Math.sqrt(x*x + y*y + z*z);
			x /= l;
			y /= l;
			z /= l;
		}

		var half = theta/2;
		var s = Math.sin(half);
		this.w = Math.cos(half);
		this.x = x*s;
		this.y = y*s;
		this.z = z*s;
	}

	// sets this quaternion's components to the inputs
	set(w, x, y, z)
	{
		//TODO: done
		this.w = w;
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	// returns the inverse quaternion as detailed in slides
	// NOTE: may assume that this quaternion is already normalized
	// because while we may use non-normalized quaternions, we will not need to invert them!
	inverse()
	{
		//TODO: done
		var ret = new Quaternion();
		ret.set(this.w, -this.x, -this.y, -this.z);
		return ret;
	}

	// keep the w component the same
	// scale x y and z components to normalize
	// (i.e. to make sum of squared components, including w, equal 1)
	// this is to ensure that floating point rounding errors don't slowly add up
	// HINT: use the pythagorean trig identity!
	renormalize()
	{
		//TODO: done
		var denom = Math.sqrt(this.w*this.w + this.x*this.x + this.y*this.y + this.z*this.z);
		this.w /= denom;
		this.x /= denom;
		this.y /= denom;
		this.z /= denom;
		return this;
	}

	 // multiply the input quaternion "q" on the left (i.e. get q * this)
	 // as usual, if "inplace" is true then modify this quaternion, otherwise return a new one
	 // if "renormalize" is true, then renormalize the result
	 // NOTE: if "inplace" is false, renormalize the NEW quaternion and NOT this one
	compose(q, inplace=true, renormalize=true)
	{
		//TODO: done
		var ret = this;
		if (!inplace) {
			ret = new Quaternion();
		}

		ret.set(
			q.w*this.w - q.x*this.x - q.y*this.y - q.z*this.z, 
			q.x*this.w + q.w*this.x + q.y*this.z - q.z*this.y, 
			q.w*this.y - q.x*this.z + q.y*this.w + q.z*this.x, 
			q.w*this.z + q.x*this.y - q.y*this.x + q.z*this.w
		);
		if (renormalize) {
			ret.renormalize();
		}

		return ret;
	}

	// apply the rotation represented by this quaternion to the input quaternion "q"
	// i.e. this * q * this.inverse()
	// return the result
	// use Quaternion.composition (static function defined below, complete it first)
	// HINT: compose multiplies from the left, so the inputs will need to be in reverse order!
	applyRotation(q) // this * q * this.inverse(), i.e. apply this quaternion to another
	{
		//TODO: done
		return Quaternion.composition([this.inverse(), q, this]);
	}

	// rotate by quaternion "q", but in local space
	// i.e. treat q's axis as if it is in local space
	// rotate q's axis by this quaternion to find it in world space
	// then compose the rotated q with this quaternion
	// don't forget to account for "inplace"!
	localCompose(q, inplace=true)
	{
		//TODO: HELP
		var t = this.applyRotation(q);
		return this.compose(t, inplace);
	}

	// return a string representation of this quaternion
	// something like "Quaternion (w, x, y, z)" but with the numerical values...
	toString()
	{
		//TODO: done
		return `Quaternion(${this.w},  ${this.x}, ${this.y}, ${this.z})`;
	}

	// input vector "v"
	// returns a pure quaternion (i.e. one with w-value 0) and with x y z values equal to v's
	// HINT: don't use "new Quaternion(0, v.x, v.y, v.z)", w does not equal the input angle
	// instead make a new quaternion and then use its "set" function before returning it
	static fromVector(v)
	{
		//TODO: done
		var ret = new Quaternion();
		return ret.set(0, v.x, v.y, v.z);
	}

	// given a list of quaternions, compose them chronologically
	// i.e. given [q1, q2, q3] return q3 * q2 * q1
	// HINT1: the "compose" function multiplies a new quaternion in from the left
	// HINT2: make sure the "renormalize" input for any "compose" calls is false
	// because we might be rotating a non-normalized pure quaternion if we're rotating a vector!
	static composition(quats) // given q1, q2, q3 returns q3 * q2 * q1
	{
		//TODO: done
		var q = quats[0];
		for (var i=1; i<quats.length; ++i)
			q = q.compose(quats[i], false, false);
		return q;
	}
}

module.exports = Quaternion;

